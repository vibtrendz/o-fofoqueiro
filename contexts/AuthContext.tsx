`use client`;

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '@/lib/firebase'; // Assuming firebase.ts is in @/lib
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean; // To distinguish admin users
  isVipUser: boolean; // To distinguish VIP users
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  adminLogin: (email: string, pass: string) => Promise<void>; // Placeholder for admin email/pass login
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVipUser, setIsVipUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Check if user is admin or VIP - this logic needs to be robust
        // For now, let's assume a mock check or a simple Firestore role check
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsAdmin(userData.role === 'admin');
          setIsVipUser(userData.role === 'vip' || userData.role === 'admin'); // Admins can also access VIP
        } else {
          // If user signed up with Google and doc doesn't exist, create it for VIP
          // This part is tricky: when does a Google sign-in become a VIP user?
          // For now, let's assume any Google sign-in is a potential VIP user
          // and we might create a user document for them.
          // This needs refinement based on actual VIP registration flow.
          setIsAdmin(false);
          setIsVipUser(false); // Default to false if no role defined
        }
        // Mock admin check for now if email matches
        if (user.email === 'admin@fofoqueiro.com') {
            setIsAdmin(true);
            setIsVipUser(true); // Admin can access VIP area
        }

      } else {
        setIsAdmin(false);
        setIsVipUser(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user) {
        // Create or update user document in Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: 'vip', // Assign 'vip' role on first Google Sign-In
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
          });
          setIsVipUser(true);
        } else {
          await setDoc(userDocRef, { lastLogin: serverTimestamp() }, { merge: true });
          setIsVipUser(userDoc.data()?.role === 'vip' || userDoc.data()?.role === 'admin');
        }
        // setCurrentUser will be updated by onAuthStateChanged
      }
    } catch (error) {
      console.error("Google login error:", error);
      // Handle error (e.g., show a notification to the user)
    } finally {
      setLoading(false);
    }
  };
  
  // Placeholder for admin email/password login - to be implemented fully
  const adminLogin = async (email: string, pass: string) => {
    // This should use signInWithEmailAndPassword and then check admin role
    console.warn("Admin email/password login not fully implemented in AuthContext", email, pass);
    // For mock purposes, if successful, onAuthStateChanged will handle user state
  };

  const logout = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      // currentUser, isAdmin, isVipUser will be reset by onAuthStateChanged
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAdmin, isVipUser, loading, loginWithGoogle, adminLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

