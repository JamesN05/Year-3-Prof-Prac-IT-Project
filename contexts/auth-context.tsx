import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

import { auth, db } from "@/firebase";
import { usernameToEmail } from "@/utils/usernameToEmail";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  async function signIn(username: string, password: string) {
    const email = usernameToEmail(username);
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function signUp(username: string, password: string) {
    const clean = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
    if (!clean) throw new Error("Invalid username.");

    const email = usernameToEmail(clean);
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    await Promise.all([
      setDoc(doc(db, "users", uid), {
        username: clean,
        createdAt: serverTimestamp(),
      }),
      setDoc(doc(db, "usernames", clean), { uid }),
    ]);
  }

  async function signOut() {
    await firebaseSignOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
