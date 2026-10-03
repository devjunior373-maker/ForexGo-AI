/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { initialForexPairs, initialHistoryItems, defaultUserProfile } from './data/forexData';
import { ForexPair, SignalHistoryItem, UserProfile } from './types';
import { Header } from './components/Header';
import { BottomTabBar } from './components/BottomTabBar';
import { OfflineIndicator } from './components/OfflineIndicator';
import { LoginScreen } from './screens/LoginScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { SignalDetailScreen } from './screens/SignalDetailScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Smartphone, Monitor } from 'lucide-react';

function TradeAIApp() {
  const { currentUser, userProfile, updateUserProfile, logout } = useAuth();

  // Routes: '/login', '/dashboard', '/analise/:par', '/historico', '/perfil'
  // A tela padrão inicial é a tela de login/cadastro
  const [currentRoute, setCurrentRoute] = useState<string>('/login');
  const [selectedPairId, setSelectedPairId] = useState<string>('eurusd');
  const [pairs, setPairs] = useState<ForexPair[]>(initialForexPairs);
  const [historyItems, setHistoryItems] = useState<SignalHistoryItem[]>(initialHistoryItems);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Combine local state with Cloud Firestore profile when user is authenticated
  const activeUser: UserProfile = {
    name: userProfile?.name || currentUser?.displayName || defaultUserProfile.name,
    email: userProfile?.email || currentUser?.email || defaultUserProfile.email,
    avatar: userProfile?.avatar || currentUser?.photoURL || defaultUserProfile.avatar,
    notificationsEnabled: userProfile?.notificationsEnabled ?? defaultUserProfile.notificationsEnabled,
    riskAlertsEnabled: userProfile?.riskAlertsEnabled ?? defaultUserProfile.riskAlertsEnabled,
    soundEnabled: userProfile?.soundEnabled ?? defaultUserProfile.soundEnabled,
    autoRefresh: userProfile?.autoRefresh ?? defaultUserProfile.autoRefresh,
    preferredPairs: userProfile?.preferredPairs || defaultUserProfile.preferredPairs,
  };

  // Desktop preview mode: 'responsive' or 'phone-mockup' (to showcase the 5 phones from us.jfif)
  const [viewMode, setViewMode] = useState<'responsive' | 'phone-mockup'>('responsive');

  // Simulated subtle price ticks every 5 seconds to feel alive like a real Forex terminal
  useEffect(() => {
    if (!activeUser.autoRefresh) return;
    const interval = setInterval(() => {
      setPairs((prevPairs) =>
        prevPairs.map((p) => {
          const isJpy = p.symbol.includes('JPY');
          const delta = (Math.random() - 0.49) * (isJpy ? 0.03 : 0.00012);
          const newPrice = Math.max(0.0001, +(p.currentPrice + delta).toFixed(isJpy ? 3 : 5));
          return {
            ...p,
            currentPrice: newPrice,
            priceDisplay: newPrice.toFixed(isJpy ? 3 : 5),
          };
        })
      );
    }, 4500);

    return () => clearInterval(interval);
  }, [activeUser.autoRefresh]);

  // Navigate handler
  const navigateTo = (route: string) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPair = (pairId: string) => {
    setSelectedPairId(pairId);
    setCurrentRoute(`/analise/${pairId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPairFromSymbol = (symbol: string) => {
    const found = pairs.find(
      (p) => p.symbol.toLowerCase() === symbol.toLowerCase() || p.id === symbol.toLowerCase().replace('/', '')
    );
    if (found) {
      handleSelectPair(found.id);
    } else {
      handleSelectPair('eurusd');
    }
  };

  // Refresh quotes manually
  const handleRefreshQuotes = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setPairs((prev) =>
        prev.map((p) => {
          const isJpy = p.symbol.includes('JPY');
          const delta = (Math.random() - 0.48) * (isJpy ? 0.06 : 0.00025);
          const newPrice = +(p.currentPrice + delta).toFixed(isJpy ? 3 : 5);
          return {
            ...p,
            currentPrice: newPrice,
            priceDisplay: newPrice.toFixed(isJpy ? 3 : 5),
          };
        })
      );
      setIsRefreshing(false);
    }, 600);
  };

  const handleUpdateProfile = async (updated: Partial<UserProfile>) => {
    if (currentUser) {
      await updateUserProfile(updated);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigateTo('/login');
  };

  // Current active pair for /analise/:par
  const currentPair = pairs.find((p) => p.id === selectedPairId) || pairs[0];

  // Derive header title
  let headerTitle: string | undefined = undefined;
  let showBack = false;

  if (currentRoute.startsWith('/analise')) {
    headerTitle = `${currentPair.symbol} - Análise`;
    showBack = true;
  } else if (currentRoute === '/historico') {
    headerTitle = 'Histórico Recente';
    showBack = false;
  } else if (currentRoute === '/perfil') {
    headerTitle = 'Perfil';
    showBack = true;
  }

  // Render active screen
  const renderScreen = () => {
    if (currentRoute === '/login') {
      return (
        <LoginScreen
          onLoginSuccess={() => {
            navigateTo('/dashboard');
          }}
        />
      );
    }

    if (currentRoute.startsWith('/analise')) {
      return (
        <SignalDetailScreen
          pair={currentPair}
          onBack={() => navigateTo('/dashboard')}
          onRefreshPair={handleRefreshQuotes}
        />
      );
    }

    if (currentRoute === '/historico') {
      return (
        <HistoryScreen
          historyItems={historyItems}
          onSelectPairFromHistory={handleSelectPairFromSymbol}
        />
      );
    }

    if (currentRoute === '/perfil') {
      return (
        <ProfileScreen
          user={activeUser}
          onUpdateUser={handleUpdateProfile}
          onLogout={handleLogout}
        />
      );
    }

    // Default: /dashboard
    return (
      <DashboardScreen
        pairs={pairs}
        user={activeUser}
        onSelectPair={handleSelectPair}
        onRefreshQuotes={handleRefreshQuotes}
        isRefreshing={isRefreshing}
      />
    );
  };

  const isLoginPage = currentRoute === '/login';

  return (
    <div className="min-h-screen w-full bg-[#121212] text-neutral-50 flex flex-col items-center">
      {/* Offline Alert Bar */}
      <OfflineIndicator />

      {/* Desktop Device Mode Floating Switcher (visible only on large screens) */}
      <div className="hidden lg:flex fixed top-3 right-4 z-50 items-center gap-1.5 p-1 bg-neutral-900/90 backdrop-blur-md border border-neutral-700 rounded-full shadow-2xl text-xs">
        <button
          onClick={() => setViewMode('phone-mockup')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition ${
            viewMode === 'phone-mockup'
              ? 'bg-cyan-500 text-neutral-950 font-bold shadow'
              : 'text-neutral-400 hover:text-white'
          }`}
          title="Ver como o mockup do smartphone (us.jfif)"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mockup Celular</span>
        </button>
        <button
          onClick={() => setViewMode('responsive')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition ${
            viewMode === 'responsive'
              ? 'bg-cyan-500 text-neutral-950 font-bold shadow'
              : 'text-neutral-400 hover:text-white'
          }`}
          title="Ver em layout responsivo de tela cheia"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Tela Responsiva</span>
        </button>
      </div>

      {/* Main Container rendering */}
      {viewMode === 'phone-mockup' ? (
        /* Phone Frame Wrapper (Simulating the 5 phone mockups in user screenshot us.jfif) */
        <div className="py-6 px-4 flex flex-col items-center justify-center w-full min-h-screen">
          <div className="relative w-full max-w-[395px] h-[844px] bg-[#121212] rounded-[48px] border-[10px] border-neutral-800 shadow-[0_0_50px_rgba(0,188,212,0.15)] ring-1 ring-cyan-500/30 overflow-hidden flex flex-col">
            {/* Phone Speaker & Camera Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-neutral-900 rounded-full z-50 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-neutral-950 border border-neutral-800 mr-2" />
              <div className="w-10 h-1 bg-neutral-800 rounded-full" />
            </div>

            {/* App Internal Body inside Phone */}
            <div className="w-full h-full flex flex-col overflow-hidden pt-4">
              {!isLoginPage && (
                <Header
                  title={headerTitle}
                  showBack={showBack}
                  onBack={() => navigateTo('/dashboard')}
                  onNavigateProfile={() => navigateTo('/perfil')}
                  user={activeUser}
                  currentRoute={currentRoute}
                />
              )}

              <main className="flex-1 overflow-y-auto flex flex-col">
                {renderScreen()}
              </main>

              {!isLoginPage && (
                <BottomTabBar
                  currentRoute={currentRoute}
                  onNavigate={(route) => navigateTo(route)}
                />
              )}
            </div>

            {/* Phone Home Gesture Pill Indicator */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-neutral-700/80 rounded-full z-50 pointer-events-none" />
          </div>
        </div>
      ) : (
        /* Fullscreen Mobile-First Responsive Applet */
        <div className="w-full min-h-screen flex flex-col bg-[#121212] max-w-full">
          {!isLoginPage && (
            <Header
              title={headerTitle}
              showBack={showBack}
              onBack={() => navigateTo('/dashboard')}
              onNavigateProfile={() => navigateTo('/perfil')}
              user={activeUser}
              currentRoute={currentRoute}
            />
          )}

          <main className="flex-1 flex flex-col w-full">
            {renderScreen()}
          </main>

          {!isLoginPage && (
            <BottomTabBar
              currentRoute={currentRoute}
              onNavigate={(route) => navigateTo(route)}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TradeAIApp />
    </AuthProvider>
  );
}
