import React, { useState } from 'react';
import { ExternalLink, X, Megaphone, Sparkles, ShieldCheck } from 'lucide-react';

interface AdBannerProps {
  className?: string;
  adSlotId?: string;
  defaultTitle?: string;
  defaultDescription?: string;
  ctaText?: string;
  ctaLink?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  className = '',
  adSlotId = 'tradeai-top-banner-01',
  defaultTitle = 'Trade AI Pro VIP • Bónus Exclusivo',
  defaultDescription = 'Abra conta na corretora parceira e receba até 100% de bónus + sinais automatizados sem taxas.',
  ctaText = 'Resgatar Bónus',
  ctaLink = '#',
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div
      id={adSlotId}
      data-ad-slot={adSlotId}
      className={`relative w-full rounded-[5px] bg-[#14161C] border border-neutral-800 p-3.5 sm:p-4 text-neutral-100 overflow-hidden shadow-sm transition hover:border-neutral-700 ${className}`}
    >
      {/* Indicador de Espaço de Anúncio / Patrocinado */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800/60">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-[5px] bg-neutral-800 text-neutral-400 border border-neutral-700/60">
            Anúncio
          </span>
          <span className="text-[11px] text-neutral-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Parceiro Oficial</span>
          </span>
        </div>

        {/* Botão de Fechar Anúncio */}
        <button
          onClick={() => setIsVisible(false)}
          className="text-neutral-500 hover:text-neutral-300 p-1 rounded transition active:scale-95 cursor-pointer"
          title="Fechar anúncio"
          aria-label="Fechar anúncio"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Conteúdo Principal do Anúncio */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1 pr-2">
          <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
            <span>{defaultTitle}</span>
          </h4>
          <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed max-w-xl">
            {defaultDescription}
          </p>
        </div>

        {/* Botão de Ação do Anunciante */}
        <div className="shrink-0 flex items-center gap-2 pt-1 sm:pt-0">
          <a
            href={ctaLink}
            onClick={(e) => {
              if (ctaLink === '#') {
                e.preventDefault();
                alert('Redirecionando para o parceiro oficial credenciado...');
              }
            }}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-[5px] bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs transition active:scale-[0.98] shadow-sm cursor-pointer whitespace-nowrap"
          >
            <span>{ctaText}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
