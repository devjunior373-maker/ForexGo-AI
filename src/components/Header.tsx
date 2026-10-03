import React, { useState } from 'react';
import { ArrowLeft, User, Bell, Check, Sparkles, X, ChevronRight } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  onNavigateProfile?: () => void;
  user?: UserProfile;
  currentRoute: string;
}

// Gerador estável de ID de usuário a partir dos dados do perfil
const getUserId = (user?: UserProfile) => {
  let hash = 0;
  const str = user?.email || user?.name || 'trader_default';
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const positive = Math.abs(hash) % 900000 + 100000;
  return `ID: #${positive}`;
};

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBack,
  onNavigateProfile,
  user,
  currentRoute,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const userId = getUserId(user);

  const notifications = [
    {
      id: '1',
      title: 'Sinal EUR/USD Confirmado',
      desc: 'Tendência de Alta validada com alvo em 1.0950 (+45 pips).',
      time: 'Há 10 min',
      unread: true,
    },
    {
      id: '2',
      title: 'Alerta de Volatilidade no Bitcoin',
      desc: 'BTC rompeu resistência de $67.000 com forte volume institucional.',
      time: 'Há 35 min',
      unread: true,
    },
    {
      id: '3',
      title: 'Relatório Econômico (NFP)',
      desc: 'Divulgação de dados econômicos dos EUA em 1 hora. Risco elevado.',
      time: 'Há 2h',
      unread: true,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-[#121212]/95 backdrop-blur-md flex items-center justify-between px-4 select-none">
      {/* Lado Esquerdo: Foto do usuário e Nome (ou Botão Voltar se em sub-tela) */}
      <div className="flex items-center gap-3">
        {showBack ? (
          <button
            onClick={onBack}
            className="flex items-center justify-center w-9 h-9 rounded-[5px] bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white active:scale-95 transition cursor-pointer"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : null}

        {/* Informações do Usuário no Lado Esquerdo */}
        <button
          onClick={onNavigateProfile}
          className="flex items-center gap-2.5 text-left group active:opacity-80 transition cursor-pointer"
          aria-label="Acessar Perfil"
        >
          {/* Foto do Usuário (sem sinal de ativo) */}
          <div className="relative">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover bg-neutral-800 border border-neutral-700/80 group-hover:border-neutral-500 transition"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 font-bold text-xs">
                {user?.name?.slice(0, 2).toUpperCase() || 'TR'}
              </div>
            )}
          </div>

          {/* Nome no lugar de Olá e ID gerado automaticamente abaixo */}
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-white tracking-tight leading-tight truncate max-w-[130px] xs:max-w-[180px] group-hover:text-cyan-400 transition">
              {user?.name || 'Trader'}
            </span>
            <span className="text-[11px] text-neutral-400 font-mono leading-tight">
              {userId}
            </span>
          </div>
        </button>

        {title && showBack && (
          <span className="hidden sm:inline-block text-xs font-semibold text-neutral-400 ml-2 border-l border-neutral-800 pl-3 truncate max-w-[180px]">
            {title}
          </span>
        )}
      </div>

      {/* Lado Direito: Ícone de Notificações */}
      <div className="relative flex items-center gap-2">
        <button
          onClick={() => {
            setShowNotifications(!showNotifications);
            if (unreadCount > 0) setUnreadCount(0);
          }}
          className="relative w-10 h-10 rounded-[5px] bg-neutral-900/90 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-white hover:border-neutral-700 transition active:scale-95 cursor-pointer shadow-sm"
          aria-label="Notificações"
        >
          <Bell className="w-4 h-4 text-neutral-300" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 animate-pulse ring-2 ring-neutral-900" />
          )}
        </button>

        {/* Modal / Dropdown de Notificações */}
        {showNotifications && (
          <div className="absolute right-0 top-12 w-72 sm:w-80 bg-[#16181F] border border-neutral-800 rounded-[5px] shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800/80">
              <div className="flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs font-bold text-white">Notificações</span>
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-neutral-500 hover:text-neutral-300 p-0.5 rounded transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-2 rounded-[5px] bg-neutral-900/60 border border-neutral-800/60 hover:border-neutral-700 transition cursor-pointer"
                  onClick={() => setShowNotifications(false)}
                >
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-neutral-100">{notif.title}</h5>
                    <span className="text-[10px] text-neutral-500">{notif.time}</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">{notif.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
