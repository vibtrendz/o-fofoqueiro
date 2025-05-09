`use client`;

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// import { auth } from '@/lib/firebase'; // To be used later
// import { signOut } from 'firebase/auth'; // To be used later

export default function AdminDashboardPage() {
  const router = useRouter();

  const handleLogout = async () => {
    // TODO: Implement Firebase sign out
    // try {
    //   await signOut(auth);
    //   localStorage.removeItem('isAdminAuthenticated'); // Clear mock auth state
    //   router.push('/login'); // Redirect to login page
    // } catch (error) {
    //   console.error("Erro ao fazer logout: ", error);
    //   alert("Erro ao tentar sair. Tente novamente.");
    // }

    // Mock logout
    localStorage.removeItem('isAdminAuthenticated');
    router.push('/login');
    console.log("Logout mock realizado");
  };

  // Mock protection - ideally this should be in a layout or middleware
  if (typeof window !== 'undefined' && !localStorage.getItem('isAdminAuthenticated')) {
    router.replace('/login');
    return <div className="text-center py-20">Redirecionando para o login...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-pink-700">Painel do Administrador</h1>
        <button 
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Sair
        </button>
      </div>
      
      <p className="mb-6 text-gray-700">
        Bem-vindo(a) ao painel de controle do "O Fofoqueiro"! Aqui você pode gerenciar todas as postagens do site.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/posts" className="block p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-pink-600 mb-2">Gerenciar Postagens</h2>
          <p className="text-gray-600">Adicionar, editar ou excluir fofocas.</p>
        </Link>
        {/* Add more links as needed, e.g., user management, settings */}
        <div className="block p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-400 mb-2">Gerenciar Usuários VIP (Em Breve)</h2>
          <p className="text-gray-500">Visualizar e gerenciar assinantes da Área VIP.</p>
        </div>
        <div className="block p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-400 mb-2">Configurações (Em Breve)</h2>
          <p className="text-gray-500">Ajustes gerais do site e do painel.</p>
        </div>
      </div>
    </div>
  );
}

