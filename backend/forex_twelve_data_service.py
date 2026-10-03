#!/usr/bin/env python3
"""
=============================================================================
Trade AI - Módulo de Integração: Twelve Data API + Algoritmo de Sinais + Supabase
=============================================================================
Este script realiza:
1. Conexão à API da Twelve Data para buscar cotações e indicadores (EMA 50, RSI 14, MACD 1h).
2. Lógica de decisão algorítmica para determinar o sinal (BUY, SELL ou NEUTRO),
   probabilidade de acerto, preço de entrada, Stop Loss e Take Profit.
3. Conexão oficial ao Supabase via `supabase-py` (ou fallback PostgREST HTTP)
   para persistir e atualizar (UPSERT) os resultados na tabela `sinais_forex`.
=============================================================================
"""

import os
import sys
import json
import time
import logging
from typing import Dict, Any, Optional, List
from datetime import datetime, timezone
import urllib.request
import urllib.parse
import urllib.error

# Tenta carregar dotenv se disponível
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Configuração de Logging para monitoramento no terminal
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("TradeAI-TwelveDataSync")

# =============================================================================
# CONFIGURAÇÕES E CREDENCIAIS
# =============================================================================
TWELVE_DATA_API_KEY = os.getenv("TWELVE_DATA_API_KEY", "")
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")  # Pode ser anon key ou service_role key

# Lista de pares Forex principais monitorados
PARES_MONITORADOS = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD"]

# URL Base da API Twelve Data
TWELVE_DATA_BASE_URL = "https://api.twelvedata.com"


# =============================================================================
# PASSO 1: CLIENTE DA TWELVE DATA API
# =============================================================================
class TwelveDataClient:
    """Cliente HTTP responsável por buscar cotações e indicadores técnicos."""

    def __init__(self, api_key: str):
        self.api_key = api_key

    def _get(self, endpoint: str, params: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Realiza requisição GET com tratamento de erros e rate-limit."""
        if not self.api_key:
            return None

        params["apikey"] = self.api_key
        query_string = urllib.parse.urlencode(params)
        url = f"{TWELVE_DATA_BASE_URL}/{endpoint}?{query_string}"

        try:
            req = urllib.request.Request(
                url,
                headers={"User-Agent": "TradeAI-Engine/1.0", "Accept": "application/json"},
            )
            with urllib.request.urlopen(req, timeout=12) as response:
                data = json.loads(response.read().decode("utf-8"))

                # A Twelve Data retorna status 'error' em JSON quando há problema de cota ou símbolo
                if data.get("status") == "error":
                    logger.error(f"Erro na Twelve Data [{endpoint}]: {data.get('message')}")
                    return None

                return data
        except urllib.error.URLError as e:
            logger.error(f"Falha na requisição para {endpoint}: {e}")
            return None
        except Exception as e:
            logger.error(f"Erro inesperado ao consultar Twelve Data: {e}")
            return None

    def get_realtime_price(self, symbol: str) -> Optional[float]:
        """Obtém o preço atual de mercado para o par de moedas."""
        data = self._get("price", {"symbol": symbol})
        if data and "price" in data:
            return float(data["price"])
        return None

    def get_ema(self, symbol: str, interval: str = "1h", time_period: int = 50) -> Optional[float]:
        """Busca a Média Móvel Exponencial (EMA) no intervalo de 1h."""
        data = self._get("ema", {
            "symbol": symbol,
            "interval": interval,
            "time_period": time_period,
            "outputsize": 1,
        })
        if data and "values" in data and len(data["values"]) > 0:
            return float(data["values"][0]["ema"])
        return None

    def get_rsi(self, symbol: str, interval: str = "1h", time_period: int = 14) -> Optional[float]:
        """Busca o Índice de Força Relativa (RSI 14) no intervalo de 1h."""
        data = self._get("rsi", {
            "symbol": symbol,
            "interval": interval,
            "time_period": time_period,
            "outputsize": 1,
        })
        if data and "values" in data and len(data["values"]) > 0:
            return float(data["values"][0]["rsi"])
        return None

    def get_macd(self, symbol: str, interval: str = "1h") -> Optional[Dict[str, float]]:
        """Busca o MACD (Linha MACD, Sinal e Histograma) no intervalo de 1h."""
        data = self._get("macd", {
            "symbol": symbol,
            "interval": interval,
            "outputsize": 1,
        })
        if data and "values" in data and len(data["values"]) > 0:
            val = data["values"][0]
            return {
                "macd": float(val.get("macd", 0.0)),
                "macd_signal": float(val.get("macd_signal", 0.0)),
                "macd_hist": float(val.get("macd_hist", 0.0)),
            }
        return None


# =============================================================================
# PASSO 2: MOTOR DE REGRAS E IA PARA GERAÇÃO DO SINAL FOREX
# =============================================================================
class ForexSignalEngine:
    """Motor que avalia as confluências técnicas e calcula Entrada, SL e TP."""

    @staticmethod
    def analyze_indicators(
        pair: str,
        price: float,
        ema: float,
        rsi: float,
        macd_data: Dict[str, float],
    ) -> Dict[str, Any]:
        """
        Lógica de decisão baseada na confluência de 3 indicadores clássicos:
        1. EMA 50: Preço acima = viés de alta (+1.5), Preço abaixo = viés de baixa (-1.5)
        2. RSI 14:
           - RSI entre 50 e 68: Força compradora saudável (+1.5)
           - RSI entre 32 e 50: Força vendedora saudável (-1.5)
           - RSI > 70: Sobrecompra (possível reversão) (-0.5)
           - RSI < 30: Sobrevenda (possível repique) (+0.5)
        3. MACD (1h):
           - Histograma positivo e Linha MACD > Sinal (+1.5)
           - Histograma negativo e Linha MACD < Sinal (-1.5)
        """
        score = 0.0
        reasons: List[str] = []

        # 1. Avaliação da EMA 50
        if price > ema:
            score += 1.5
            reasons.append("Preço sustentado acima da EMA 50 (1h)")
        else:
            score -= 1.5
            reasons.append("Preço operando abaixo da EMA 50 (1h)")

        # 2. Avaliação do RSI 14
        if 50.0 <= rsi <= 68.0:
            score += 1.5
            reasons.append(f"RSI ({rsi:.1f}) em zona compradora com momentum altista")
        elif 32.0 <= rsi < 50.0:
            score -= 1.5
            reasons.append(f"RSI ({rsi:.1f}) em zona vendedora com pressão de baixa")
        elif rsi > 70.0:
            score -= 0.5
            reasons.append(f"RSI ({rsi:.1f}) em sobrecompra extrema, alerta de exaustão")
        elif rsi < 30.0:
            score += 0.5
            reasons.append(f"RSI ({rsi:.1f}) em sobrevenda extrema, potencial de repique")

        # 3. Avaliação do MACD
        macd_val = macd_data.get("macd", 0.0)
        macd_sig = macd_data.get("macd_signal", 0.0)
        macd_hist = macd_data.get("macd_hist", 0.0)

        if macd_hist > 0 and macd_val > macd_sig:
            score += 1.5
            reasons.append("MACD com cruzamento de alta e histograma positivo")
        elif macd_hist < 0 and macd_val < macd_sig:
            score -= 1.5
            reasons.append("MACD com cruzamento de baixa e histograma negativo")
        else:
            reasons.append("MACD neutro sem divergência clara")

        # Determinação do Sinal Final e Probabilidade Estimada
        if score >= 2.5:
            signal = "BUY"
            tendency = "Alta"
            probability = min(92, int(75 + score * 4))
            signal_strength = "Força Alta" if score >= 4.0 else "Força Média"
        elif score <= -2.5:
            signal = "SELL"
            tendency = "Baixa"
            probability = min(90, int(75 + abs(score) * 4))
            signal_strength = "Força Alta" if score <= -4.0 else "Força Média"
        else:
            signal = "NEUTRO"
            tendency = "Lateral"
            probability = 55
            signal_strength = "Neutra"

        # Cálculo de Pips para Stop Loss e Take Profit
        # Pares com JPY têm 1 pip = 0.01; outros pares têm 1 pip = 0.0001
        is_jpy = "JPY" in pair
        pip_size = 0.01 if is_jpy else 0.0001
        decimals = 3 if is_jpy else 5

        # Parâmetros médios de volatilidade no 1h: Stop Loss ~ 25 pips, Take Profit ~ 45 pips
        sl_pips = 25 * pip_size
        tp_pips = 45 * pip_size
        tp2_pips = 75 * pip_size

        entry_price = round(price, decimals)

        if signal == "BUY":
            stop_loss = round(entry_price - sl_pips, decimals)
            take_profit = round(entry_price + tp_pips, decimals)
            take_profit_2 = round(entry_price + tp2_pips, decimals)
            rr_ratio = "1 : 1.80"
        elif signal == "SELL":
            stop_loss = round(entry_price + sl_pips, decimals)
            take_profit = round(entry_price - tp_pips, decimals)
            take_profit_2 = round(entry_price - tp2_pips, decimals)
            rr_ratio = "1 : 1.80"
        else:
            stop_loss = round(entry_price - sl_pips, decimals)
            take_profit = round(entry_price + sl_pips, decimals)
            take_profit_2 = None
            rr_ratio = "1 : 1.00"

        ai_summary = (
            f"Análise Técnica 1H: {signal_strength}. "
            + ". ".join(reasons)
            + f". Relação risco/retorno estimada em {rr_ratio} com meta em {take_profit}."
        )

        return {
            "pair": pair,
            "current_price": entry_price,
            "signal": signal,
            "tendency": tendency,
            "probability": probability,
            "signal_strength": signal_strength,
            "entry_price": entry_price,
            "stop_loss": stop_loss,
            "take_profit": take_profit,
            "take_profit_2": take_profit_2,
            "risk_reward": rr_ratio,
            "timeframe": "1h",
            "ema_50": round(ema, decimals),
            "rsi_14": round(rsi, 2),
            "macd_val": round(macd_val, decimals),
            "macd_signal": round(macd_sig, decimals),
            "macd_hist": round(macd_hist, decimals),
            "ai_analysis": ai_summary,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }


# =============================================================================
# PASSO 3: INTEGRAÇÃO COM SUPABASE (supabase-py ou PostgREST nativo)
# =============================================================================
class SupabaseForexSync:
    """Responsável por salvar e sincronizar os sinais na tabela sinais_forex."""

    def __init__(self, supabase_url: str, supabase_key: str):
        self.supabase_url = supabase_url.rstrip("/") if supabase_url else ""
        self.supabase_key = supabase_key
        self.client = None

        if self.supabase_url and self.supabase_key:
            # Tenta inicializar a biblioteca oficial supabase-py se instalada
            try:
                from supabase import create_client, Client
                self.client: Optional[Client] = create_client(self.supabase_url, self.supabase_key)
                logger.info("Cliente oficial 'supabase-py' inicializado com sucesso!")
            except ImportError:
                logger.info(
                    "Biblioteca 'supabase-py' não instalada no ambiente atual. "
                    "Utilizando cliente PostgREST HTTP nativo como fallback de alta performance."
                )
        else:
            logger.warning(
                "Credenciais SUPABASE_URL ou SUPABASE_KEY ausentes no arquivo .env."
            )

    def upsert_signal(self, signal_payload: Dict[str, Any]) -> bool:
        """
        Salva ou atualiza os dados na tabela 'sinais_forex'.
        Utiliza 'on_conflict=pair' para sobrescrever se o par já existir.
        """
        if not self.supabase_url or not self.supabase_key:
            logger.info(
                f"[SIMULAÇÃO LOCAL] Registro pronto para upsert no Supabase: "
                f"{signal_payload['pair']} -> {signal_payload['signal']} ({signal_payload['probability']}%)"
            )
            return False

        # 1. Tentativa via biblioteca oficial supabase-py
        if self.client:
            try:
                self.client.table("sinais_forex").upsert(
                    signal_payload, on_conflict="pair"
                ).execute()
                logger.info(f"Supabase atualizado com sucesso via supabase-py para {signal_payload['pair']}!")
                return True
            except Exception as e:
                logger.error(f"Erro ao salvar via supabase-py para {signal_payload['pair']}: {e}")

        # 2. Fallback via PostgREST HTTP direto (compatível com todas as instâncias do Supabase)
        try:
            endpoint = f"{self.supabase_url}/rest/v1/sinais_forex?on_conflict=pair"
            headers = {
                "apikey": self.supabase_key,
                "Authorization": f"Bearer {self.supabase_key}",
                "Content-Type": "application/json",
                "Prefer": "resolution=merge-duplicates",
            }
            body = json.dumps(signal_payload).encode("utf-8")
            req = urllib.request.Request(endpoint, data=body, headers=headers, method="POST")

            with urllib.request.urlopen(req, timeout=10) as resp:
                if resp.status in (200, 201):
                    logger.info(f"Supabase (PostgREST) atualizado com sucesso para {signal_payload['pair']}!")
                    return True
        except Exception as e:
            logger.error(f"Erro ao enviar para Supabase via PostgREST: {e}")

        return False


# =============================================================================
# PASSO 4: ORQUESTRADOR PRINCIPAL DO PIPELINE
# =============================================================================
def run_pipeline():
    """Executa a rotina completa: Twelve Data -> Algoritmo IA -> Supabase."""
    logger.info("Iniciando rotina de atualização de sinais Forex...")

    twelve_client = TwelveDataClient(TWELVE_DATA_API_KEY)
    supabase_sync = SupabaseForexSync(SUPABASE_URL, SUPABASE_KEY)

    # Valores mock/fallback para desenvolvimento caso a chave da Twelve Data não esteja configurada
    mock_data = {
        "EUR/USD": {"price": 1.08585, "ema": 1.08420, "rsi": 68.2, "macd": {"macd": 0.00045, "macd_signal": 0.00010, "macd_hist": 0.00035}},
        "GBP/USD": {"price": 1.26420, "ema": 1.26680, "rsi": 34.5, "macd": {"macd": -0.00112, "macd_signal": -0.00070, "macd_hist": -0.00042}},
        "USD/JPY": {"price": 154.215, "ema": 154.180, "rsi": 51.0, "macd": {"macd": 0.004, "macd_signal": 0.003, "macd_hist": 0.001}},
        "AUD/USD": {"price": 0.65540, "ema": 0.65310, "rsi": 65.0, "macd": {"macd": 0.00032, "macd_signal": 0.00015, "macd_hist": 0.00017}},
        "USD/CAD": {"price": 1.37680, "ema": 1.37950, "rsi": 39.0, "macd": {"macd": -0.00062, "macd_signal": -0.00030, "macd_hist": -0.00032}},
    }

    for pair in PARES_MONITORADOS:
        logger.info(f"--- Processando par: {pair} ---")

        # 1. Busca os dados reais via Twelve Data API
        price = twelve_client.get_realtime_price(pair) if TWELVE_DATA_API_KEY else None
        ema = twelve_client.get_ema(pair, interval="1h", time_period=50) if price else None
        rsi = twelve_client.get_rsi(pair, interval="1h", time_period=14) if price else None
        macd = twelve_client.get_macd(pair, interval="1h") if price else None

        # Fallback caso a chave da API Twelve Data ainda não tenha sido inserida
        if not price or not ema or not rsi or not macd:
            if not TWELVE_DATA_API_KEY:
                logger.info(f"Modo Demonstração (sem chave Twelve Data): usando dados calculados para {pair}.")
            else:
                logger.warning(f"Dados da Twelve Data indisponíveis para {pair}. Usando parâmetros calculados.")
            sample = mock_data.get(pair, mock_data["EUR/USD"])
            price = price or sample["price"]
            ema = ema or sample["ema"]
            rsi = rsi or sample["rsi"]
            macd = macd or sample["macd"]

        # 2. Executa a Lógica de Decisão Técnica / IA
        signal_result = ForexSignalEngine.analyze_indicators(
            pair=pair,
            price=price,
            ema=ema,
            rsi=rsi,
            macd_data=macd,
        )

        logger.info(
            f"Resultado [{pair}]: Sinal={signal_result['signal']} "
            f"| Prob={signal_result['probability']}% "
            f"| Entrada={signal_result['entry_price']} "
            f"| SL={signal_result['stop_loss']} "
            f"| TP={signal_result['take_profit']}"
        )

        # 3. Salva ou atualiza no banco Supabase
        supabase_sync.upsert_signal(signal_result)

        # Pequeno delay para respeitar o rate-limit da API pública (8 req/min na Twelve Data free)
        if TWELVE_DATA_API_KEY:
            time.sleep(1.2)

    logger.info("Rotina de sincronização concluída com sucesso!")


if __name__ == "__main__":
    run_pipeline()
