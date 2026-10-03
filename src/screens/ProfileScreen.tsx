import React, { useState } from 'react';
import { UserProfile } from '../types';
import { PWAInstallButton } from '../components/PWAInstallButton';
import {
  User,
  Bell,
  AlertTriangle,
  FileText,
  Shield,
  LogOut,
  Smartphone,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Sliders,
  X,
  Volume2,
} from 'lucide-react';

interface ProfileScreenProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onUpdateUser,
  onLogout,
}) => {
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPairsModal, setShowPairsModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleToggleNotification = () => {
    const nextVal = !user.notificationsEnabled;
    onUpdateUser({ notificationsEnabled: nextVal });
    showToast(nextVal ? 'Notificações de sinais ativadas!' : 'Notificações desativadas');
  };

  const handleToggleRiskAlerts = () => {
    const nextVal = !user.riskAlertsEnabled;
    onUpdateUser({ riskAlertsEnabled: nextVal });
    showToast(nextVal ? 'Alertas de risco ativados!' : 'Alertas de risco desativados');
  };

  const availablePairs = [
    'EUR/USD',
    'GBP/USD',
    'USD/JPY',
    'AUD/USD',
    'USD/CAD',
    'USD/CHF',
    'EUR/JPY',
    'GBP/JPY',
  ];

  const togglePreferredPair = (pair: string) => {
    let nextList = [...user.preferredPairs];
    if (nextList.includes(pair)) {
      if (nextList.length <= 1) {
        showToast('Selecione pelo menos 1 par favorito.');
        return;
      }
      nextList = nextList.filter((p) => p !== pair);
    } else {
      nextList.push(pair);
    }
    onUpdateUser({ preferredPairs: nextList });
  };

  return (
    <div className="flex-1 overflow-y-auto pb-28 p-4 space-y-8 max-w-xl mx-auto w-full select-none">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-cyan-400 text-neutral-950 font-bold px-4 py-2 rounded-xl text-xs shadow-xl animate-fade-in flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Área do Usuário */}
      <div className="flex flex-col items-center justify-center text-center pt-2">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-cyan-400/80 p-0.5 shadow-xl shadow-cyan-500/20 bg-neutral-900">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-cyan-400 border-2 border-neutral-950 flex items-center justify-center text-neutral-950 shadow">
            <CheckCircle className="w-3.5 h-3.5" />
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white mt-3 tracking-tight">
          {user.name}
        </h2>
        <p className="text-xs text-neutral-400 font-mono mt-0.5">{user.email}</p>

        <div className="mt-3 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
            Plano VIP Trader Pro
          </span>
          <span className="px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Online
          </span>
        </div>
      </div>

      {/* Seção Configurações */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider px-1">
          Configurações
        </h3>

        <div className="bg-[#1E1E1E] rounded-2xl border border-[#333333] shadow-lg divide-y divide-neutral-800 overflow-hidden">
          {/* Item 1: Notificações de Sinais */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-semibold text-white">Notificações de Sinais</h4>
              </div>
              <p className="text-xs text-neutral-400">
                Receba alertas instantâneos de novas ordens BUY/SELL.
              </p>
            </div>

            {/* Custom Cyan Toggle Switch */}
            <button
              onClick={handleToggleNotification}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out shrink-0 ${
                user.notificationsEnabled ? 'bg-[#00BCD4]' : 'bg-neutral-700'
              }`}
              aria-label="Alternar Notificações de Sinais"
            >
              <div
                className={`bg-neutral-950 w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                  user.notificationsEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Item 2: Alertas de Risco */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-semibold text-white">Alertas de Risco</h4>
              </div>
              <p className="text-xs text-neutral-400">
                Aviso quando posições atingirem 80% do Stop Loss ou Take Profit.
              </p>
            </div>

            {/* Custom Cyan Toggle Switch */}
            <button
              onClick={handleToggleRiskAlerts}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out shrink-0 ${
                user.riskAlertsEnabled ? 'bg-[#00BCD4]' : 'bg-neutral-700'
              }`}
              aria-label="Alternar Alertas de Risco"
            >
              <div
                className={`bg-neutral-950 w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                  user.riskAlertsEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Item 3: Preferências de Pares */}
          <div
            onClick={() => setShowPairsModal(true)}
            className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-neutral-800/40 transition cursor-pointer"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-semibold text-white">Preferências de Pares</h4>
              </div>
              <p className="text-xs text-neutral-400 truncate max-w-[240px] sm:max-w-xs">
                {user.preferredPairs.join(', ')}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
          </div>

          {/* Item 4: Instalar PWA */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-semibold text-white">App Mobile (PWA)</h4>
              </div>
              <p className="text-xs text-neutral-400">
                Instale no smartphone para acesso rápido em tela cheia.
              </p>
            </div>
            <PWAInstallButton variant="compact" />
          </div>
        </div>
      </div>

      {/* Seção Legal */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider px-1">
          Legal
        </h3>

        <div className="bg-[#1E1E1E] rounded-2xl border border-[#333333] shadow-lg divide-y divide-neutral-800 overflow-hidden">
          {/* Aviso de Risco Forex */}
          <div
            onClick={() => setShowRiskModal(true)}
            className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-neutral-800/40 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-semibold text-white">Aviso de Risco Forex</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
          </div>

          {/* Termos de Serviço */}
          <div
            onClick={() => setShowTermsModal(true)}
            className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-neutral-800/40 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-white">Termos de Serviço</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
          </div>
        </div>
      </div>

      {/* Botão: Terminar Sessão */}
      <div className="pt-2">
        <button
          onClick={onLogout}
          className="w-full min-h-[48px] rounded-2xl bg-transparent border border-[#FF5252] text-[#FF5252] hover:bg-red-500/10 font-bold text-sm transition active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Terminar Sessão</span>
        </button>
      </div>

      {/* Modal: Aviso de Risco Forex */}
      {showRiskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#1E1E1E] border border-neutral-700 rounded-2xl p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setShowRiskModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-amber-400 mb-3">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Aviso de Risco Forex e Alavancagem</h3>
            </div>
            <div className="text-xs text-neutral-300 space-y-3 leading-relaxed">
              <p>
                A negociação de moedas estrangeiras (Forex) e Contratos por Diferença (CFDs)
                envolve um alto nível de risco e pode não ser adequada para todos os investidores.
              </p>
              <p>
                O alto grau de alavancagem pode operar tanto a seu favor quanto contra você. Antes de
                decidir negociar qualquer ativo no mercado cambial, você deve considerar
                cuidadosamente seus objetivos de investimento, nível de experiência e apetite por risco.
              </p>
              <p>
                Existe a possibilidade de incorrer em perdas parciais ou totais do seu capital
                investido. Nunca invista recursos que não possa se dar ao luxo de perder.
              </p>
              <p className="text-cyan-400 font-semibold">
                Os sinais gerados pelo Trade AI são baseados em algoritmos estatísticos e análise técnica,
                constituindo ferramentas informativas e não aconselhamento financeiro mandatório.
              </p>
            </div>
            <button
              onClick={() => setShowRiskModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Modal: Termos de Serviço */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#1E1E1E] border border-neutral-700 rounded-2xl p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setShowTermsModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-cyan-400 mb-3">
              <FileText className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Termos de Serviço - Trade AI</h3>
            </div>
            <div className="text-xs text-neutral-300 space-y-3 leading-relaxed">
              <p>
                Ao acessar e utilizar o aplicativo Trade AI, você concorda com nossos termos e diretrizes
                de operação segura.
              </p>
              <p>
                1. <strong>Licença de Uso:</strong> O aplicativo concede uma licença pessoal e não transferível para acesso aos relatórios analíticos.
              </p>
              <p>
                2. <strong>Precisão dos Dados:</strong> Os dados de cotação e sinais são processados em alta velocidade, sujeitos à latência das redes globais e liquidez interbancária.
              </p>
              <p>
                3. <strong>Privacidade:</strong> Seus dados de preferência são mantidos estritamente confidenciais e criptografados localmente.
              </p>
            </div>
            <button
              onClick={() => setShowTermsModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition"
            >
              Concordo
            </button>
          </div>
        </div>
      )}

      {/* Modal: Preferências de Pares */}
      {showPairsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-[#1E1E1E] border border-neutral-700 rounded-2xl p-5 shadow-2xl relative">
            <button
              onClick={() => setShowPairsModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-base font-bold text-white mb-2">Pares de Moedas Ativos</h3>
            <p className="text-xs text-neutral-400 mb-4">
              Selecione os pares que você deseja monitorar no seu radar:
            </p>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {availablePairs.map((p) => {
                const isSelected = user.preferredPairs.includes(p);
                return (
                  <button
                    key={p}
                    onClick={() => togglePreferredPair(p)}
                    className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                        : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white'
                    }`}
                  >
                    <span>{p}</span>
                    {isSelected && <CheckCircle className="w-4 h-4 text-cyan-400" />}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setShowPairsModal(false)}
              className="mt-4 w-full py-2.5 rounded-xl bg-cyan-400 text-neutral-950 font-bold text-xs hover:bg-cyan-300 transition"
            >
              Salvar Preferências
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
