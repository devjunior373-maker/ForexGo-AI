import React from 'react';

interface CurrencyFlagProps {
  pair: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CurrencyFlag: React.FC<CurrencyFlagProps> = ({
  pair,
  size = 'md',
  className = '',
}) => {
  const parts = pair.split('/');
  const base = parts[0] || 'EUR';
  const quote = parts[1] || 'USD';

  const sizeDimensions = {
    sm: 'w-7 h-7 text-[9px]',
    md: 'w-10 h-10 text-[10px]',
    lg: 'w-12 h-12 text-xs',
  };

  const renderSingleFlag = (code: string) => {
    switch (code.toUpperCase()) {
      case 'EUR':
        return (
          <svg viewBox="0 0 512 512" className="w-full h-full object-cover">
            <rect width="512" height="512" fill="#003399" />
            <g fill="#FFCC00" transform="translate(256,256) scale(0.85)">
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180;
                const x = 160 * Math.sin(angle);
                const y = -160 * Math.cos(angle);
                return (
                  <polygon
                    key={i}
                    points="0,-16 4.7,-4 16,-4 7.4,3 10.7,15 0,8 -10.7,15 -7.4,3 -16,-4 -4.7,-4"
                    transform={`translate(${x},${y}) scale(1.1)`}
                  />
                );
              })}
            </g>
          </svg>
        );
      case 'USD':
        return (
          <svg viewBox="0 0 512 512" className="w-full h-full object-cover">
            <rect width="512" height="512" fill="#B22234" />
            {[1, 3, 5, 7, 9, 11].map((i) => (
              <rect key={i} y={i * 39.38} width="512" height="39.38" fill="#FFFFFF" />
            ))}
            <rect width="220" height="275" fill="#3C3B6E" />
            {/* Stars pattern preview */}
            <g fill="#FFFFFF">
              {[...Array(20)].map((_, idx) => {
                const row = Math.floor(idx / 5);
                const col = idx % 5;
                return (
                  <circle
                    key={idx}
                    cx={25 + col * 42}
                    cy={25 + row * 55}
                    r="6"
                  />
                );
              })}
            </g>
          </svg>
        );
      case 'GBP':
        return (
          <svg viewBox="0 0 512 512" className="w-full h-full object-cover">
            <rect width="512" height="512" fill="#012169" />
            <path d="M 0,0 L 512,512 M 512,0 L 0,512" stroke="#FFFFFF" strokeWidth="60" />
            <path d="M 0,0 L 512,512 M 512,0 L 0,512" stroke="#C8102E" strokeWidth="25" />
            <path d="M 256,0 V 512 M 0,256 H 512" stroke="#FFFFFF" strokeWidth="100" />
            <path d="M 256,0 V 512 M 0,256 H 512" stroke="#C8102E" strokeWidth="60" />
          </svg>
        );
      case 'JPY':
        return (
          <svg viewBox="0 0 512 512" className="w-full h-full object-cover">
            <rect width="512" height="512" fill="#FFFFFF" />
            <circle cx="256" cy="256" r="145" fill="#BC002D" />
          </svg>
        );
      case 'AUD':
        return (
          <svg viewBox="0 0 512 512" className="w-full h-full object-cover">
            <rect width="512" height="512" fill="#00008B" />
            {/* Mini Union Jack canton */}
            <g transform="scale(0.5)">
              <rect width="512" height="512" fill="#012169" />
              <path d="M 0,0 L 512,512 M 512,0 L 0,512" stroke="#FFFFFF" strokeWidth="60" />
              <path d="M 256,0 V 512 M 0,256 H 512" stroke="#FFFFFF" strokeWidth="100" />
              <path d="M 256,0 V 512 M 0,256 H 512" stroke="#C8102E" strokeWidth="60" />
            </g>
            {/* Commonwealth Star */}
            <circle cx="120" cy="380" r="45" fill="#FFFFFF" />
            {/* Southern cross dots */}
            <circle cx="380" cy="140" r="14" fill="#FFFFFF" />
            <circle cx="430" cy="220" r="14" fill="#FFFFFF" />
            <circle cx="380" cy="380" r="14" fill="#FFFFFF" />
            <circle cx="330" cy="260" r="14" fill="#FFFFFF" />
          </svg>
        );
      case 'CAD':
        return (
          <svg viewBox="0 0 512 512" className="w-full h-full object-cover">
            <rect width="130" height="512" fill="#FF0000" />
            <rect x="130" width="252" height="512" fill="#FFFFFF" />
            <rect x="382" width="130" height="512" fill="#FF0000" />
            {/* Maple Leaf outline stylized */}
            <path
              d="M 256 120 L 275 190 L 330 170 L 310 220 L 350 250 L 290 280 L 270 270 L 270 370 L 242 370 L 242 270 L 222 280 L 162 250 L 202 220 L 182 170 L 237 190 Z"
              fill="#FF0000"
            />
          </svg>
        );
      case 'CHF':
        return (
          <svg viewBox="0 0 512 512" className="w-full h-full object-cover">
            <rect width="512" height="512" fill="#D52B1E" />
            <rect x="216" y="100" width="80" height="312" fill="#FFFFFF" rx="4" />
            <rect x="100" y="216" width="312" height="80" fill="#FFFFFF" rx="4" />
          </svg>
        );
      default:
        return (
          <div className="w-full h-full flex items-center justify-center font-bold bg-neutral-800 text-cyan-400">
            {code}
          </div>
        );
    }
  };

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      {/* Primary Base Flag */}
      <div
        className={`${sizeDimensions[size]} rounded-full overflow-hidden border-2 border-neutral-700/80 shadow-md ring-1 ring-cyan-500/20`}
      >
        {renderSingleFlag(base)}
      </div>
      {/* Quote Flag overlapping badge */}
      <div
        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full overflow-hidden border border-neutral-900 shadow-sm`}
      >
        {renderSingleFlag(quote)}
      </div>
    </div>
  );
};
