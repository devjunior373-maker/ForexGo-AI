import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share2, PlusSquare, X, Check } from 'lucide-react';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'compact' | 'full' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'compact'
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  // If already installed in standalone mode
  if (isInstalled || justInstalled) {
    if (variant === 'banner') {
      return (
        <div className="flex items-center gap-2 p-3 bg-neutral-900 border border-green-500/30 rounded-xl text-green-400 text-xs">
          <Check className="w-4 h-4 shrink-0" />
          <span>Aplicativo Trade AI instalado com sucesso no seu dispositivo!</span>
        </div>
      );
    }
    return null;
  }

  const handleInstall = async () => {
    const success = await install();
    if (success) {
      setJustInstalled(true);
    }
  };

  if (variant === 'banner') {
    return (
      <div className="p-4 rounded-xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-cyan-950/40 border border-cyan-500/40 shadow-lg relative overflow-hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <h4 className="text-sm font-semibold text-white">Instalar App Mobile</h4>
            </div>
            <p className="text-xs text-neutral-400">
              Tenha alertas de sinais instantâneos direto na sua tela inicial sem precisar abrir o navegador.
            </p>
          </div>
          {isIOS ? (
            <button
              onClick={() => setShowIOSGuide(true)}
              className="shrink-0 px-3.5 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Instalar</span>
            </button>
          ) : (
            <button
              onClick={handleInstall}
              className="shrink-0 px-3.5 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Instalar</span>
            </button>
          )}
        </div>

        {/* iOS Guide Modal */}
        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-neutral-900 border border-neutral-700 p-6 shadow-2xl relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white rounded-lg bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                <Download className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-white mb-2">Instalar no iPhone / iPad</h3>
              <p className="text-xs text-neutral-400 mb-4">
                Siga os 2 passos rápidos para instalar o Trade AI no seu iOS Safari:
              </p>

              <div className="space-y-3 text-xs text-neutral-300 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">1</div>
                  <span>Toque no botão <strong className="text-white flex items-center gap-1 inline-flex"><Share2 className="w-3 h-3 text-cyan-400 inline" /> Compartilhar</strong> no Safari.</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">2</div>
                  <span>Role para baixo e selecione <strong className="text-white flex items-center gap-1 inline-flex"><PlusSquare className="w-3 h-3 text-cyan-400 inline" /> Adicionar à Tela de Início</strong>.</span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full py-2.5 rounded-xl bg-cyan-400 font-semibold text-neutral-950 text-xs hover:bg-cyan-300 transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Compact header button
  return (
    <>
      <button
        onClick={isIOS ? () => setShowIOSGuide(true) : handleInstall}
        title="Instalar App Trade AI"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 text-xs font-medium transition active:scale-95 ${className}`}
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden xs:inline">App</span>
      </button>

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-neutral-900 border border-neutral-700 p-6 shadow-2xl relative text-left">
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white rounded-lg bg-neutral-800"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <Download className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-white mb-2">Instalar no iPhone / iPad</h3>
            <p className="text-xs text-neutral-400 mb-4">
              Instale o Trade AI na tela inicial em segundos:
            </p>

            <div className="space-y-3 text-xs text-neutral-300 bg-neutral-950 p-3.5 rounded-xl border border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">1</div>
                <span>Toque no ícone de <strong className="text-white">Compartilhar</strong> na barra do Safari.</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">2</div>
                <span>Selecione <strong className="text-white">Adicionar à Tela de Início</strong>.</span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-cyan-400 font-semibold text-neutral-950 text-xs hover:bg-cyan-300 transition-colors"
            >
              Concluído
            </button>
          </div>
        </div>
      )}
    </>
  );
};
