import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User } from '@restaurant/shared';

export const authService = {
  async signUp(email: string, password: string, displayName: string): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    const user: Omit<User, 'id'> = {
      email,
      displayName,
      role: 'customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), user);
    return { id: firebaseUser.uid, ...user };
  },

  async signIn(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (!userDoc.exists()) throw new Error('User document not found');

    return { id: firebaseUser.uid, ...userDoc.data() } as User;
  },

  async signOut(): Promise<void> {
    await signOut(auth);
  },

  async getCurrentUser(): Promise<User | null> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return null;

    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (!userDoc.exists()) return null;

    return { id: firebaseUser.uid, ...userDoc.data() } as User;
  },

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (!firebaseUser) {
        callback(null);
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        callback(null);
        return;
      }

      callback({ id: firebaseUser.uid, ...userDoc.data() } as User);
    });
  },
};
