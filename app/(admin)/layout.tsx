"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
// import { auth } from '@/lib/firebase'; // To be used later
// import { onAuthStateChanged, signOut } from 'firebase/auth'; // To be used later

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Mock authentication check
    const checkAuth = () => {
      const adminAuth = localStorage.getItem('isAdminAuthenticated');
      if (adminAuth === 'true') {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        if (pathname !== '/login') { // Avoid redirect loop if already on login page
          router.replace('/login');
        }
      }
      setLoading(false);
    };

    // TODO: Replace with Firebase onAuthStateChanged for real authentication
    // const unsubscribe = onAuthStateChanged(auth, (user) => {
    //   if (user) {
    //     // Here you might want to check if the user is an admin based on custom claims or a Firestore document
    //     setIsAuthenticated(true); 
    //   } else {
    //     setIsAuthenticated(false);
    //     if (pathname !== '/login') {
    //        router.replace('/login');
    //     }
    //   }
    //   setLoading(false);
    // });
    // return () => unsubscribe();

    checkAuth();
  }, [router, pathname]);

  const handleLogout = async () => {
    // Mock logout
    localStorage.removeItem('isAdminAuthenticated');
    setIsAuthenticated(false);
    router.push('/login');

    // TODO: Implement Firebase sign out
    // try {
    //   await signOut(auth);
    //   router.push('/login');
    // } catch (error) {
    //   console.error("Erro ao fazer logout: ", error);
    //   alert("Erro ao tentar sair. Tente novamente.");
    // }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <p className="text-xl text-pink-600">Verificando autenticação...</p>
      </div>
    );
  }

  // If not authenticated and not on the login page, AdminLayout might not even render its children due to redirect.
  // However, this check is an additional safeguard.
  if (!isAuthenticated && pathname !== '/login') {
    // This part might be redundant if the useEffect already redirects.
    // It's here to ensure children are not rendered if auth status changes unexpectedly.
    return null; 
  }
  
  // Don't render admin navigation if on the login page itself
  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-pink-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/admin/dashboard" className="text-2xl font-bold hover:text-pink-200 transition-colors">
            O Fofoqueiro - Admin
          </Link>
          <div className="space-x-4">
            <Link href="/admin/dashboard" className={`hover:text-pink-200 transition-colors ${pathname === '/admin/dashboard' ? 'font-semibold' : ''}`}>Dashboard</Link>
            <Link href="/admin/posts" className={`hover:text-pink-200 transition-colors ${pathname.startsWith('/admin/posts') ? 'font-semibold' : ''}`}>Postagens</Link>
            {/* Add other admin links here */}
            <button 
              onClick={handleLogout} 
              className="bg-pink-500 hover:bg-pink-600 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-4 sm:p-6">
        {children}
      </main>
      <footer className="bg-gray-200 text-center p-4 text-sm text-gray-600 mt-auto">
        Painel Administrativo &copy; {new Date().getFullYear()} O Fofoqueiro
      </footer>
    </div>
  );
}

