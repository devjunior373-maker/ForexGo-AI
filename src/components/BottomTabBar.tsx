import React from 'react';
import { LayoutGrid, History, User } from 'lucide-react';

interface BottomTabBarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentRoute,
  onNavigate,
}) => {
  const tabs = [
    {
      route: '/dashboard',
      label: 'Dashboard',
      icon: LayoutGrid,
    },
    {
      route: '/historico',
      label: 'Histórico',
      icon: History,
    },
    {
      route: '/perfil',
      label: 'Perfil',
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-lg border-t border-neutral-800 pb-[env(safe-area-inset-bottom)] shadow-2xl">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive =
            tab.route === currentRoute ||
            (tab.route === '/dashboard' && currentRoute.startsWith('/analise'));
          const Icon = tab.icon;

          return (
            <button
              key={tab.route}
              onClick={() => onNavigate(tab.route)}
              className={`flex-1 flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-all select-none relative group ${
                isActive ? 'text-cyan-400 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {/* Active top glow indicator dot */}
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-cyan-400 rounded-b-full shadow-lg shadow-cyan-400/50" />
              )}

              <div
                className={`p-1 rounded-xl transition ${
                  isActive ? 'bg-cyan-500/10 scale-105' : 'group-hover:bg-neutral-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-neutral-400'}`} />
              </div>
              <span className={`text-[11px] mt-0.5 tracking-tight ${isActive ? 'text-cyan-400' : 'text-neutral-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
