import React from 'react';

interface CryptoIconProps {
  symbol: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const CryptoIcon: React.FC<CryptoIconProps> = ({
  symbol,
  size = 'sm',
  className = '',
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5 sm:w-6 sm:h-6',
    md: 'w-7 h-7 sm:w-8 sm:h-8',
    lg: 'w-10 h-10',
  };

  const dim = sizeClasses[size];
  const sym = symbol.toUpperCase().trim();

  // 1. Bitcoin (BTC) - Ícone Oficial
  if (sym === 'BTC' || sym === 'BITCOIN' || sym.includes('BTC')) {
    return (
      <div className={`shrink-0 rounded-full overflow-hidden flex items-center justify-center ${dim} ${className}`}>
        <svg viewBox="0 0 32 32" className="w-full h-full" fill="none">
          <circle cx="16" cy="16" r="16" fill="#F7931A" />
          <path
            d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.745-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.314-1.256-.314l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.705 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.535 2.146-4.148.986-5.318.695l.95-3.805c1.17.292 4.929.872 4.368 3.11zm.535-5.569c-.488 1.954-3.495.962-4.47.719l.86-3.45c.974.242 4.12.695 3.61 2.731z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    );
  }

  // 2. Ethereum (ETH) - Ícone Oficial Diamante Cristal
  if (sym === 'ETH' || sym === 'ETHEREUM' || sym.includes('ETH')) {
    return (
      <div className={`shrink-0 rounded-full overflow-hidden flex items-center justify-center ${dim} ${className}`}>
        <svg viewBox="0 0 32 32" className="w-full h-full" fill="none">
          <circle cx="16" cy="16" r="16" fill="#627EEA" />
          <g fill="#FFFFFF">
            <polygon points="16.498 4 16.275 4.756 16.275 20.399 16.498 20.622 23.995 16.191" fillOpacity="0.6" />
            <polygon points="16.498 4 9 16.191 16.498 20.622 16.498 12.87" />
            <polygon points="16.498 21.968 16.372 22.122 16.372 27.731 16.498 28.098 24 17.538" fillOpacity="0.6" />
            <polygon points="16.498 28.098 16.498 21.968 9 17.538" />
            <polygon points="16.498 20.622 23.995 16.191 16.498 12.87" fillOpacity="0.2" />
            <polygon points="9 16.191 16.498 20.622 16.498 12.87" fillOpacity="0.6" />
          </g>
        </svg>
      </div>
    );
  }

  // 3. Solana (SOL) - Ícone Oficial com Gradiente
  if (sym === 'SOL' || sym === 'SOLANA' || sym.includes('SOL')) {
    return (
      <div className={`shrink-0 rounded-full overflow-hidden flex items-center justify-center ${dim} ${className}`}>
        <svg viewBox="0 0 32 32" className="w-full h-full" fill="none">
          <circle cx="16" cy="16" r="16" fill="#000000" />
          <defs>
            <linearGradient id="solGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00FFA3" />
              <stop offset="100%" stopColor="#DC1FFF" />
            </linearGradient>
          </defs>
          <path
            d="M8.2 21.8c.2-.2.5-.3.8-.3h12.7c.5 0 .8.2 1 .6.2.4.1.8-.2 1.1l-2.4 2.4c-.2.2-.5.3-.8.3H6.6c-.5 0-.8-.2-1-.6-.2-.4-.1-.8.2-1.1l2.4-2.4z"
            fill="url(#solGrad)"
          />
          <path
            d="M8.2 6.1c.2-.2.5-.3.8-.3h12.7c.5 0 .8.2 1 .6.2.4.1.8-.2 1.1l-2.4 2.4c-.2.2-.5.3-.8.3H6.6c-.5 0-.8-.2-1-.6-.2-.4-.1-.8.2-1.1l2.4-2.4z"
            fill="url(#solGrad)"
          />
          <path
            d="M23.8 14c-.2-.2-.5-.3-.8-.3H10.3c-.5 0-.8.2-1 .6-.2.4-.1.8.2 1.1l2.4 2.4c.2.2.5.3.8.3h12.7c.5 0 .8-.2 1-.6.2-.4.1-.8-.2-1.1L23.8 14z"
            fill="url(#solGrad)"
          />
        </svg>
      </div>
    );
  }

  // 4. Tether (USDT) - Ícone Oficial
  if (sym === 'USDT' || sym === 'TETHER' || sym.includes('USDT')) {
    return (
      <div className={`shrink-0 rounded-full overflow-hidden flex items-center justify-center ${dim} ${className}`}>
        <svg viewBox="0 0 32 32" className="w-full h-full" fill="none">
          <circle cx="16" cy="16" r="16" fill="#26A17B" />
          <path
            d="M17.922 17.383c-.11.008-.687.042-1.922.042-1.035 0-1.72-.034-1.89-.042v-2.316h3.812v2.316zm0-4.043v-1.63h5.714V7.545H8.364V11.71h5.746v1.63c-4.469.213-7.828 1.096-7.828 2.155 0 1.059 3.359 1.942 7.828 2.155v7.05h3.812v-7.05c4.444-.213 7.784-1.096 7.784-2.155 0-1.059-3.34-1.942-7.784-2.155z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    );
  }

  // 5. Euro (EURO / EUR) - Bandeira Oficial da União Europeia
  if (sym === 'EUR' || sym === 'EURO' || sym.includes('EUR')) {
    return (
      <div className={`shrink-0 rounded-full overflow-hidden flex items-center justify-center ring-1 ring-neutral-700/50 ${dim} ${className}`}>
        <svg viewBox="0 0 512 512" className="w-full h-full">
          <rect width="512" height="512" fill="#003399" />
          <g fill="#FFCC00" transform="translate(256,256) scale(0.9)">
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const x = 160 * Math.sin(angle);
              const y = -160 * Math.cos(angle);
              return (
                <polygon
                  key={i}
                  points="0,-16 4.7,-4 16,-4 7.4,3 10.7,15 0,8 -10.7,15 -7.4,3 -16,-4 -4.7,-4"
                  transform={`translate(${x},${y}) scale(1.15)`}
                />
              );
            })}
          </g>
        </svg>
      </div>
    );
  }

  // 6. Dólar (USD / DXY) - Bandeira Oficial dos EUA
  if (sym === 'USD' || sym === 'DXY' || sym.includes('USD')) {
    return (
      <div className={`shrink-0 rounded-full overflow-hidden flex items-center justify-center ring-1 ring-neutral-700/50 ${dim} ${className}`}>
        <svg viewBox="0 0 512 512" className="w-full h-full">
          <rect width="512" height="512" fill="#B22234" />
          {[1, 3, 5, 7, 9, 11].map((i) => (
            <rect key={i} y={i * 39.38} width="512" height="39.38" fill="#FFFFFF" />
          ))}
          <rect width="230" height="275" fill="#3C3B6E" />
          <g fill="#FFFFFF">
            {[...Array(24)].map((_, idx) => {
              const row = Math.floor(idx / 6);
              const col = idx % 6;
              return (
                <circle
                  key={idx}
                  cx={25 + col * 36}
                  cy={25 + row * 45}
                  r="7"
                />
              );
            })}
          </g>
        </svg>
      </div>
    );
  }

  // 7. Ouro (XAU / GOLD) - Barra de Ouro Oficial
  if (sym === 'XAU' || sym === 'GOLD' || sym.includes('XAU')) {
    return (
      <div className={`shrink-0 rounded-full overflow-hidden flex items-center justify-center bg-amber-500/20 ring-1 ring-amber-500/40 ${dim} ${className}`}>
        <svg viewBox="0 0 32 32" className="w-full h-full p-0.5" fill="none">
          <circle cx="16" cy="16" r="16" fill="#D97706" />
          {/* Gold Bar shape */}
          <polygon points="8,19 12,11 24,11 20,19" fill="#FDE047" />
          <polygon points="12,11 24,11 20,13 8,13" fill="#FEF08A" />
          <polygon points="24,11 26,17 20,19 20,13" fill="#CA8A04" />
          <polygon points="6,23 8,19 20,19 18,23" fill="#EAB308" />
          <polygon points="18,23 20,19 26,17 24,21" fill="#A16207" />
        </svg>
      </div>
    );
  }

  // Fallback genérico elegante
  return (
    <div
      className={`shrink-0 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-[9px] text-cyan-400 ${dim} ${className}`}
    >
      {sym.slice(0, 3)}
    </div>
  );
};
