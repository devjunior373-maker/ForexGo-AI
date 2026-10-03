import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';

/**
 * Interface do perfil de utilizador conforme especificado em firebase-blueprint.json
 */
export interface FirebaseUserProfile {
  uid: string;
  name: string;
  email: string;
  avatar?: string;
  plan?: string;
  notificationsEnabled?: boolean;
  riskAlertsEnabled?: boolean;
  soundEnabled?: boolean;
  autoRefresh?: boolean;
  preferredPairs?: string[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Serviço centralizado para operações de leitura e escrita no Cloud Firestore
 */
export const firebaseService = {
  /**
   * Obtém o perfil de um utilizador do Firestore pelo seu UID
   * @param userId UID do utilizador autenticado
   */
  async getUserProfile(userId: string): Promise<FirebaseUserProfile | null> {
    const path = `users/${userId}`;
    const userDocRef = doc(db, 'users', userId);

    try {
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        return docSnap.data() as FirebaseUserProfile;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  },

  /**
   * Cria ou sobrescreve o documento de perfil no Firestore
   * @param profile Dados do perfil em conformidade com o esquema
   */
  async saveUserProfile(profile: FirebaseUserProfile): Promise<void> {
    const path = `users/${profile.uid}`;
    const userDocRef = doc(db, 'users', profile.uid);

    const sanitizedData: FirebaseUserProfile = {
      uid: profile.uid,
      name: profile.name.slice(0, 100),
      email: profile.email.slice(0, 120),
      avatar: profile.avatar ? profile.avatar.slice(0, 500) : undefined,
      plan: profile.plan ? profile.plan.slice(0, 50) : 'VIP Trader Pro',
      notificationsEnabled: profile.notificationsEnabled ?? true,
      riskAlertsEnabled: profile.riskAlertsEnabled ?? true,
      soundEnabled: profile.soundEnabled ?? false,
      autoRefresh: profile.autoRefresh ?? true,
      preferredPairs: profile.preferredPairs ? profile.preferredPairs.slice(0, 20) : [],
      createdAt: profile.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(userDocRef, sanitizedData);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  /**
   * Atualiza campos específicos do perfil do utilizador
   * @param userId UID do utilizador
   * @param updates Campos a serem atualizados
   */
  async updateUserPreferences(
    userId: string,
    updates: Partial<Omit<FirebaseUserProfile, 'uid'>>
  ): Promise<void> {
    const path = `users/${userId}`;
    const userDocRef = doc(db, 'users', userId);

    const payload: Record<string, any> = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    try {
      await updateDoc(userDocRef, payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  /**
   * Listener em tempo real (onSnapshot) para sincronização instantânea do perfil
   * @param userId UID do utilizador
   * @param onUpdate Callback executado a cada mudança no Firestore
   * @param onError Callback opcional de erro
   */
  subscribeToUserProfile(
    userId: string,
    onUpdate: (profile: FirebaseUserProfile | null) => void,
    onError?: (error: unknown) => void
  ): Unsubscribe {
    const path = `users/${userId}`;
    const userDocRef = doc(db, 'users', userId);

    return onSnapshot(
      userDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          onUpdate(snapshot.data() as FirebaseUserProfile);
        } else {
          onUpdate(null);
        }
      },
      (error) => {
        console.warn(`[Firestore Snapshot Error em ${path}]:`, error);
        if (onError) {
          onError(error);
        } else {
          handleFirestoreError(error, OperationType.GET, path);
        }
      }
    );
  },

  /**
   * Remove o perfil do utilizador no Firestore
   * @param userId UID do utilizador
   */
  async deleteUserProfile(userId: string): Promise<void> {
    const path = `users/${userId}`;
    const userDocRef = doc(db, 'users', userId);

    try {
      await deleteDoc(userDocRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },
};
