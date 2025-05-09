`use client`;

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext'; // Adjust path as needed
import { LogOut, UserCircle, BookOpen, Zap } from 'lucide-react'; // Icons for navigation

export default function VipLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, isVipUser, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !currentUser) {
      // If not loading and no user, redirect to VIP login
      router.replace('/login-vip');
    } else if (!loading && currentUser && !isVipUser) {
      // If user is logged in but not a VIP user (e.g. admin only, or other roles in future)
      // For now, this case might be rare if all Google sign-ins are VIPs
      // or if admin is also VIP. If a non-VIP user somehow lands here, redirect.
      alert("Acesso VIP necessário. Redirecionando...");
      router.replace('/'); // Or to a specific non-VIP page
    }
  }, [currentUser, isVipUser, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login-vip');
    } catch (error) {
      console.error("Erro ao fazer logout da Área VIP: ", error);
      alert("Erro ao tentar sair. Tente novamente.");
    }
  };

  if (loading || !currentUser || !isVipUser) {
    // Show loading or a blank screen while redirecting or verifying auth
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
        <p className="text-xl text-white animate-pulse">Carregando Área VIP...</p>
      </div>
    );
  }

  // User is authenticated and is a VIP user
  return (
    <div className="min-h-screen flex flex-col bg-purple-50">
      <header className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/vip/learn" className="text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity">
              O Fofoqueiro <span className="text-yellow-300">VIP</span>
            </Link>
            <nav className="flex items-center space-x-3 sm:space-x-4">
              <Link href="/vip/learn" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors ${pathname === "/vip/learn" ? "bg-purple-700" : ""}`}>
                <BookOpen size={18} className="mr-1 sm:mr-2" /> <span className="hidden sm:inline">Aprender</span>
              </Link>
              <Link href="/vip/quizzes" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors ${pathname.startsWith("/vip/quizzes") ? "bg-purple-700" : ""}`}>
                 <Zap size={18} className="mr-1 sm:mr-2" /> <span className="hidden sm:inline">Quizzes</span>
              </Link>
              <Link href="/vip/profile" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors ${pathname === "/vip/profile" ? "bg-purple-700" : ""}`}>
                <UserCircle size={18} className="mr-1 sm:mr-2" /> <span className="hidden sm:inline">Perfil</span>
              </Link>
              <button 
                onClick={handleLogout} 
                className="flex items-center bg-pink-500 hover:bg-pink-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <LogOut size={18} className="mr-1 sm:mr-2" /> <span className="hidden sm:inline">Sair</span>
              </button>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      <footer className="bg-purple-100 border-t border-purple-200 text-center p-4">
        <p className="text-sm text-purple-700">
          Área VIP - Aprenda Inglês com Fofoca &copy; {new Date().getFullYear()} O Fofoqueiro.
        </p>
      </footer>
    </div>
  );
}

