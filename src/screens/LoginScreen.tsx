import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginScreenProps {
  onLoginSuccess: (email: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, authError, clearError } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isLoading, setIsLoading] = useState<'email' | 'google' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (mode === 'signup') {
      if (!username.trim()) {
        setLocalError('Por favor, introduza o seu Nome de Utilizador.');
        return;
      }
      if (!email || !password || !confirmPassword) {
        setLocalError('Por favor, preencha todos os campos.');
        return;
      }
      if (password.length < 6) {
        setLocalError('A password deve ter no mínimo 6 caracteres.');
        return;
      }
      if (password !== confirmPassword) {
        setLocalError('As passwords não coincidem. Verifique a confirmação.');
        return;
      }
    } else {
      if (!email || !password) {
        setLocalError('Preencha seu e-mail e password.');
        return;
      }
    }

    setIsLoading('email');
    try {
      if (mode === 'login') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, username.trim());
      }
      onLoginSuccess(email);
    } catch (err: any) {
      setLocalError(err.message || 'Não foi possível concluir a autenticação.');
    } finally {
      setIsLoading(null);
    }
  };

  const handleGoogleSignIn = async () => {
    setLocalError('');
    clearError();
    setIsLoading('google');
    try {
      await signInWithGoogle();
      onLoginSuccess(email || 'Google User');
    } catch (err: any) {
      setLocalError(err.message || 'Falha na autenticação com Google.');
    } finally {
      setIsLoading(null);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen w-full bg-[#0D0F12] text-neutral-100 flex flex-col justify-center items-center px-4 py-8 select-none">
      <div className="w-full max-w-xs sm:max-w-sm flex flex-col">
        {/* Título estilizado de alta tecnologia */}
        <div className="mb-8 text-center">
          <h1 className="font-brand text-2xl sm:text-[28px] font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-neutral-300 drop-shadow-sm">
            TRADE <span className="text-white">AI</span>
          </h1>
        </div>

        {/* Sem card - elementos integrados diretamente no background */}
        <div className="w-full flex flex-col">
          {/* Alternância sutil entre Entrar e Criar conta */}
          <div className="flex p-1 bg-neutral-900 rounded-[5px] mb-6 border border-neutral-800">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setLocalError('');
                clearError();
              }}
              className={`flex-1 py-1.5 text-xs font-medium rounded-[5px] transition ${
                mode === 'login'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setLocalError('');
                clearError();
              }}
              className={`flex-1 py-1.5 text-xs font-medium rounded-[5px] transition ${
                mode === 'signup'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Criar conta
            </button>
          </div>

          {/* Mensagem de Erro */}
          {displayError && (
            <div className="mb-4 px-3 py-2 rounded-[5px] bg-red-950/40 border border-red-800/50 text-red-300 text-xs leading-relaxed text-center">
              {displayError}
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Campo Nome de Utilizador (exclusivo para Criar conta) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Nome de Utilizador
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Seu nome ou apelido"
                    required
                    className="w-full h-10 pl-9 pr-3 rounded-[5px] bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder-neutral-500 text-xs focus:outline-none focus:border-neutral-600 transition"
                  />
                </div>
              </div>
            )}

            {/* Campo E-mail */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                E-mail
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@email.com"
                  required
                  className="w-full h-10 pl-9 pr-3 rounded-[5px] bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder-neutral-500 text-xs focus:outline-none focus:border-neutral-600 transition"
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-10 pl-9 pr-9 rounded-[5px] bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder-neutral-500 text-xs focus:outline-none focus:border-neutral-600 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Campo Confirmação de Password (exclusivo para Criar conta) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Confirmação de Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a password"
                    required
                    className="w-full h-10 pl-9 pr-9 rounded-[5px] bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder-neutral-500 text-xs focus:outline-none focus:border-neutral-600 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Botão de Envio (Entrar / Criar conta) */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading !== null}
                className="w-full h-10 rounded-[5px] bg-white hover:bg-neutral-200 text-neutral-950 font-medium text-xs transition active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isLoading === 'email' ? (
                  <span className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Entrar' : 'Criar conta'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Divisor */}
          <div className="relative my-4 flex items-center justify-center">
            <div className="w-full border-t border-neutral-800" />
            <span className="absolute bg-[#0D0F12] px-2.5 text-[11px] text-neutral-500 uppercase tracking-wider">
              ou
            </span>
          </div>

          {/* Botão de Registo / Login Social com Google (Firebase Auth) */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading !== null}
            className="w-full py-2.5 px-4 rounded-[5px] bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-200 hover:text-white text-xs font-medium transition active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continuar com Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};
