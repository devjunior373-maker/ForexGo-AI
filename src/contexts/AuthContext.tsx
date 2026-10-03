import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile as updateFirebaseProfile,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';
import { UserProfile } from '../types';

export interface FirebaseUserProfile extends UserProfile {
  uid: string;
  plan: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: FirebaseUserProfile | null;
  loading: boolean;
  authError: string | null;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  updateUserProfile: (data: Partial<FirebaseUserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<FirebaseUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearError = () => setAuthError(null);

  // Monitor auth state and synchronize Firestore profile
  useEffect(() => {
    let unsubscribeFirestore: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const path = `users/${user.uid}`;

        // Ensure user document exists in Firestore
        try {
          const docSnap = await getDoc(userDocRef);
          if (!docSnap.exists()) {
            const initialData: FirebaseUserProfile = {
              uid: user.uid,
              name: user.displayName || user.email?.split('@')[0] || 'Trader',
              email: user.email || '',
              avatar:
                user.photoURL ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
              plan: 'VIP Trader Pro',
              notificationsEnabled: true,
              riskAlertsEnabled: true,
              soundEnabled: false,
              autoRefresh: true,
              preferredPairs: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD'],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, initialData);
            setUserProfile(initialData);
          } else {
            setUserProfile(docSnap.data() as FirebaseUserProfile);
          }
        } catch (error) {
          console.warn('Aguardando sincronização do perfil Firestore:', error);
          setUserProfile({
            uid: user.uid,
            name: user.displayName || user.email?.split('@')[0] || 'Trader',
            email: user.email || '',
            avatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
            plan: 'VIP Trader Pro',
            notificationsEnabled: true,
            riskAlertsEnabled: true,
            soundEnabled: false,
            autoRefresh: true,
            preferredPairs: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }

        // Attach realtime Firestore listener
        try {
          unsubscribeFirestore = onSnapshot(
            userDocRef,
            (snapshot) => {
              if (snapshot.exists()) {
                setUserProfile(snapshot.data() as FirebaseUserProfile);
              }
              setLoading(false);
            },
            (error) => {
              console.warn('Aviso de snapshot Firestore:', error);
              setLoading(false);
            }
          );
        } catch (err) {
          console.warn('Erro ao anexar snapshot:', err);
          setLoading(false);
        }
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  }, []);

  // 1. Signup with Email, Password & Name
  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    setLoading(true);
    setAuthError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const user = userCredential.user;

      if (name) {
        await updateFirebaseProfile(user, { displayName: name });
      }

      // Create profile record in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const initialProfile: FirebaseUserProfile = {
        uid: user.uid,
        name: name || email.split('@')[0] || 'Novo Trader',
        email: user.email || email,
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        plan: 'VIP Trader Pro',
        notificationsEnabled: true,
        riskAlertsEnabled: true,
        soundEnabled: false,
        autoRefresh: true,
        preferredPairs: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      try {
        await setDoc(userDocRef, initialProfile);
        setUserProfile(initialProfile);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}`);
      }
    } catch (err: any) {
      const msg = mapFirebaseAuthError(err?.code || err?.message);
      setAuthError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // 2. Sign In with Email & Password
  const signInWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      const msg = mapFirebaseAuthError(err?.code || err?.message);
      setAuthError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // 3. Sign In with Google
  const signInWithGoogle = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      const msg = mapFirebaseAuthError(err?.code || err?.message);
      setAuthError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // 4. Update Profile in Cloud Firestore
  const updateUserProfile = async (data: Partial<FirebaseUserProfile>) => {
    if (!currentUser) return;
    const userDocRef = doc(db, 'users', currentUser.uid);
    const path = `users/${currentUser.uid}`;

    try {
      const updatedPayload = {
        ...data,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(userDocRef, updatedPayload, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  // 5. Logout
  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (err: any) {
      setAuthError('Erro ao encerrar sessão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        authError,
        signUpWithEmail,
        signInWithEmail,
        signInWithGoogle,
        updateUserProfile,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};

// Tradução amigável de erros do Firebase Auth
function mapFirebaseAuthError(codeOrMsg: string): string {
  if (codeOrMsg.includes('auth/invalid-email')) {
    return 'Endereço de email inválido.';
  }
  if (codeOrMsg.includes('auth/user-not-found') || codeOrMsg.includes('auth/wrong-password') || codeOrMsg.includes('auth/invalid-credential')) {
    return 'Email ou senha incorretos.';
  }
  if (codeOrMsg.includes('auth/email-already-in-use')) {
    return 'Este email já está cadastrado. Tente fazer login.';
  }
  if (codeOrMsg.includes('auth/weak-password')) {
    return 'A senha deve conter no mínimo 6 caracteres.';
  }
  if (codeOrMsg.includes('auth/popup-closed-by-user')) {
    return 'A janela de autenticação foi fechada antes da conclusão.';
  }
  return 'Ocorreu um erro na autenticação. Tente novamente.';
}
