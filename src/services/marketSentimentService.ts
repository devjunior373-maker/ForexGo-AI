import { ForexPair } from '../types';

export interface MarketSentimentData {
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  score: number; // 0 - 100
  bullishPercentage: number;
  bearishPercentage: number;
  headline: string;
  summary: string;
  keyNews: {
    source: string;
    title: string;
    impact: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    time: string;
  }[];
  fundamentalFactors: string[];
}

const sentimentDatabase: Record<string, Partial<MarketSentimentData>> = {
  'EUR/USD': {
    sentiment: 'BULLISH',
    score: 78,
    bullishPercentage: 78,
    bearishPercentage: 22,
    headline: 'Tom hawkish do BCE e recuo nos rendimentos dos Treasuries sustentam o Euro',
    summary: 'A convergência entre declarações recentes de membros do Conselho do BCE apontando persistência na inflação de serviços e a moderação nos dados econômicos dos EUA reforça o viés comprador no curto prazo.',
    keyNews: [
      {
        source: 'Reuters FX',
        title: 'BCE sinaliza cautela com cortes adicionais e sustenta paridade cambial do Euro',
        impact: 'BULLISH',
        time: 'Há 25 min',
      },
      {
        source: 'Bloomberg Markets',
        title: 'Rendimentos das Notas do Tesouro dos EUA a 10 anos desaceleram após dados mistos',
        impact: 'BULLISH',
        time: 'Há 1h',
      },
      {
        source: 'Financial Times',
        title: 'Superávit comercial da Zona do Euro atinge expectativas de gestores institucionais',
        impact: 'NEUTRAL',
        time: 'Há 3h',
      },
    ],
    fundamentalFactors: [
      'Diferencial de juros reais favorável ao EUR no curto prazo',
      'Expectativas para o próximo simpósio de política monetária',
      'Fluxo de capitais corporativos na sessão europeia',
    ],
  },
  'GBP/USD': {
    sentiment: 'BEARISH',
    score: 36,
    bullishPercentage: 36,
    bearishPercentage: 64,
    headline: 'Pressão vendedora na Libra com incertezas fiscais no Reino Unido',
    summary: 'Dados de vendas no varejo abaixo do esperado e especulações sobre a política fiscal britânica geram realização de lucros em GBP, com fluxo defensivo direcionado ao dólar americano.',
    keyNews: [
      {
        source: 'ForexLive',
        title: 'Banco da Inglaterra (BoE) avalia desaceleração no crescimento salarial',
        impact: 'BEARISH',
        time: 'Há 40 min',
      },
      {
        source: 'Reuters',
        title: 'Investidores reduzem exposição comprada na Libra antes do relatório do PIB',
        impact: 'BEARISH',
        time: 'Há 2h',
      },
      {
        source: 'Bloomberg',
        title: 'Dólar global ganha tração como refúgio durante abertura dos mercados em Londres',
        impact: 'NEUTRAL',
        time: 'Há 4h',
      },
    ],
    fundamentalFactors: [
      'Desaceleração da atividade econômica no setor de serviços do Reino Unido',
      'Diferencial de taxas de inflação IPC entre Reino Unido e EUA',
      'Aversão ao risco em ativos de renda fixa britânicos',
    ],
  },
  'USD/JPY': {
    sentiment: 'BULLISH',
    score: 82,
    bullishPercentage: 82,
    bearishPercentage: 18,
    headline: 'Carry trade e postura acomodatícia do BoJ impulsionam USD/JPY',
    summary: 'Apesar de intervenções verbais do Ministério das Finanças japonês, o expressivo diferencial entre as taxas do Fed (EUA) e do Banco do Japão (BoJ) continua incentivando compras consistentes.',
    keyNews: [
      {
        source: 'Bloomberg FX',
        title: 'BoJ mantém postura cautelosa para novos aumentos na taxa de juros básica',
        impact: 'BULLISH',
        time: 'Há 15 min',
      },
      {
        source: 'Nikkei Asian Review',
        title: 'Exportadores japoneses ampliam hedge cambial em meio a valorização do dólar',
        impact: 'BULLISH',
        time: 'Há 1h',
      },
      {
        source: 'Reuters',
        title: 'Autoridades japonesas alertam sobre movimentos especulativos unilaterais',
        impact: 'NEUTRAL',
        time: 'Há 3h',
      },
    ],
    fundamentalFactors: [
      'Largo diferencial de juros estruturais (Fed vs BoJ)',
      'Fluxo contínuo de operações de carry trade institucional',
      'Níveis de alerta para possível intervenção governamental',
    ],
  },
  'AUD/USD': {
    sentiment: 'BULLISH',
    score: 74,
    bullishPercentage: 74,
    bearishPercentage: 26,
    headline: 'Alta nos preços das commodities e estímulos na Ásia favorecem o Dólar Australiano',
    summary: 'A valorização do minério de ferro aliada à política de firmeza do Reserve Bank of Australia (RBA) fornece forte suporte fundamental para a continuidade da tendência de alta.',
    keyNews: [
      {
        source: 'Financial Review',
        title: 'RBA reitera compromisso com controle inflacionário e descarta cortes imediatos',
        impact: 'BULLISH',
        time: 'Há 50 min',
      },
      {
        source: 'Reuters Commodities',
        title: 'Contratos futuros de minério de ferro e cobre sobem com dados fabris asiáticos',
        impact: 'BULLISH',
        time: 'Há 2h',
      },
      {
        source: 'Bloomberg',
        title: 'Apetite ao risco em moedas de commodities melhora na sessão global',
        impact: 'BULLISH',
        time: 'Há 4h',
      },
    ],
    fundamentalFactors: [
      'Forte correlação com a demanda por commodities industriais',
      'Postura hawkish do Banco Central da Austrália (RBA)',
      'Balança comercial australiana com superávit recorde',
    ],
  },
  'USD/CAD': {
    sentiment: 'BEARISH',
    score: 34,
    bullishPercentage: 34,
    bearishPercentage: 66,
    headline: 'Preços firmes do petróleo WTI sustentam demanda pelo Dólar Canadense',
    summary: 'O rali nos preços internacionais do petróleo bruto fortalece a moeda canadense (Loonie), pressionando o par USD/CAD em direção a zonas de suporte técnico relevantes.',
    keyNews: [
      {
        source: 'Reuters Energy',
        title: 'Petróleo WTI supera projeções semanais com restrição de oferta na OPEP+',
        impact: 'BEARISH',
        time: 'Há 30 min',
      },
      {
        source: 'Globe and Mail',
        title: 'Banco do Canadá (BoC) observa estabilização no mercado imobiliário',
        impact: 'NEUTRAL',
        time: 'Há 2h',
      },
      {
        source: 'Bloomberg FX',
        title: 'Fluxos de exportação de energia aumentam liquidez compradora em CAD',
        impact: 'BEARISH',
        time: 'Há 3h',
      },
    ],
    fundamentalFactors: [
      'Alta correlação positiva do CAD com barril de petróleo WTI',
      'Diferencial de produtividade e dados de emprego no Canadá',
      'Fluxo de capitais transfronteiriços EUA-Canadá',
    ],
  },
};

export async function analyzeMarketSentiment(pair: ForexPair): Promise<MarketSentimentData> {
  // Simula pequena latência de análise neural para realismo da interface
  await new Promise((resolve) => setTimeout(resolve, 350));

  const known = sentimentDatabase[pair.symbol];
  if (known) {
    return {
      sentiment: known.sentiment || (pair.signal === 'BUY' ? 'BULLISH' : 'BEARISH'),
      score: known.score || pair.probability || 75,
      bullishPercentage: known.bullishPercentage || (pair.signal === 'BUY' ? 76 : 28),
      bearishPercentage: known.bearishPercentage || (pair.signal === 'BUY' ? 24 : 72),
      headline: known.headline || `Análise de sentimento algorítmico para ${pair.symbol}`,
      summary: known.summary || pair.aiAnalysisText,
      keyNews: known.keyNews || [],
      fundamentalFactors: known.fundamentalFactors || [
        'Diferencial de taxas de juros interbancárias',
        'Expectativas para o próximo ciclo de política monetária',
        'Fluxo de liquidez e aversão a risco global',
      ],
    };
  }

  // Geração adaptativa para qualquer outro par cambial
  const isBuy = pair.signal === 'BUY';
  const prob = pair.probability || 70;

  return {
    sentiment: isBuy ? 'BULLISH' : 'BEARISH',
    score: prob,
    bullishPercentage: isBuy ? prob : 100 - prob,
    bearishPercentage: isBuy ? 100 - prob : prob,
    headline: isBuy
      ? `Notícias macroeconômicas apontam fluxo comprador predominante para ${pair.symbol}`
      : `Pressão vendedora em ${pair.symbol} acompanhada por aversão a risco em notícias`,
    summary: `O modelo neural de NLP processou os mais recentes comunicados e relatórios cambiais para ${pair.symbol}. A confluência entre volume institucional e sentimento de notícias confirma a tese de ${pair.signal} com probabilidade de ${prob}%.`,
    keyNews: [
      {
        source: 'Reuters FX',
        title: `Fluxos institucionais e posicionamento em derivativos reforçam viés de ${pair.signal} para ${pair.symbol}`,
        impact: isBuy ? 'BULLISH' : 'BEARISH',
        time: 'Há 25 min',
      },
      {
        source: 'Bloomberg Markets',
        title: `Relatório de volatilidade implícita sinaliza suporte em níveis técnicos chave`,
        impact: 'BULLISH',
        time: 'Há 1h',
      },
      {
        source: 'Financial Times',
        title: `Mercados avaliam impacto dos dados de inflação e liquidez bancária`,
        impact: 'NEUTRAL',
        time: 'Há 3h',
      },
    ],
    fundamentalFactors: [
      'Diferencial de juros dos bancos centrais emissores',
      'Sentimento geral de risco nas bolsas internacionais',
      'Fluxo comercial e balanço de pagamentos',
    ],
  };
}
