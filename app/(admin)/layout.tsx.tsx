"use client";

import { ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Ícones (exemplo, substitua pelos seus ou use uma biblioteca como lucide-react)
const DashboardIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>;
const PostsIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>;
const LogoutIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>;

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-pink-50"><p className="text-pink-600 text-xl">Carregando...</p></div>;
  }

  if (!user) {
    // Idealmente, o useEffect já redirecionou, mas isso é uma garantia.
    return null; 
  }

  const isActive = (path: string) => pathname === path || (path !== '/admin/dashboard' && pathname.startsWith(path));

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-pink-50">
      <aside className="w-full md:w-64 bg-pink-700 text-white p-4 md:p-6 space-y-4 md:space-y-6 shadow-lg">
        <div className="text-center mb-4 md:mb-8">
          <Link href="/admin/dashboard" className="text-2xl md:text-3xl font-bold hover:text-pink-200 transition-colors">
            O Fofoqueiro
          </Link>
          <p className="text-sm text-pink-200">Painel Admin</p>
        </div>
        <nav className="space-y-2">
          <Link href="/admin/dashboard" 
            className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-pink-600 transition-colors ${isActive('/admin/dashboard') ? 'bg-pink-800 font-semibold' : ''}`}>
            <DashboardIcon />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/posts"
            className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-pink-600 transition-colors ${isActive('/admin/posts') ? 'bg-pink-800 font-semibold' : ''}`}>
            <PostsIcon />
            <span>Postagens</span>
          </Link>
          {/* Adicionar mais links de navegação aqui, se necessário */}
        </nav>
        <div className="mt-auto pt-4 md:pt-6 border-t border-pink-500">
          <button
            onClick={async () => {
              await logout();
              router.push('/login');
            }}
            className="flex items-center space-x-3 p-3 w-full text-left rounded-lg hover:bg-pink-600 transition-colors text-pink-100 hover:text-white"
          >
            <LogoutIcon />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

