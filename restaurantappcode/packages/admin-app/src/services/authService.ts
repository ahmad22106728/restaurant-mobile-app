import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User } from '@restaurant/shared';

export const authService = {
  async signIn(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (!userDoc.exists()) throw new Error('User document not found');

    const user = { id: firebaseUser.uid, ...userDoc.data() } as User;
    if (user.role !== 'admin') throw new Error('Unauthorized: Admin access required');

    return user;
  },

  async signOut(): Promise<void> {
    await signOut(auth);
  },

  async getCurrentUser(): Promise<User | null> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return null;

    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (!userDoc.exists()) return null;

    const user = { id: firebaseUser.uid, ...userDoc.data() } as User;
    if (user.role !== 'admin') return null;

    return user;
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

      const user = { id: firebaseUser.uid, ...userDoc.data() } as User;
      if (user.role !== 'admin') {
        callback(null);
        return;
      }

      callback(user);
    });
  },
};
