`use client`;

import React from 'react';
import { useAuth } from '@/contexts/AuthContext'; // Adjust path as needed
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc'; // Using react-icons for Google icon

export default function VipLoginPage() {
  const { loginWithGoogle, currentUser, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-purple-50"><p className="text-xl text-purple-700">Carregando...</p></div>;
  }

  if (currentUser) {
    router.replace('/vip/learn'); // Redirect if already logged in
    return <div className="min-h-screen flex items-center justify-center bg-purple-50"><p className="text-xl text-purple-700">Redirecionando para a Área VIP...</p></div>;
  }

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      // The onAuthStateChanged listener in AuthContext should handle redirection
      // or currentUser state update, which will trigger the redirect above.
      // router.push('/vip/learn'); // Fallback redirect, might not be needed
    } catch (error) {
      console.error("Erro no login com Google (página):", error);
      // Display error to user if necessary
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300 p-4">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-md text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-purple-700 mb-4">Área VIP</h1>
        <p className="text-gray-600 mb-8 text-lg">
Aprenda Inglês de forma divertida com as últimas fofocas internacionais!
        </p>
        
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-md font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-70 transition-all duration-150 ease-in-out transform hover:scale-105"
        >
          <FcGoogle className="mr-3 text-2xl" />
          {loading ? 'Entrando com Google...' : 'Entrar com Google'}
        </button>

        <p className="mt-8 text-sm text-gray-500">
          Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade (links de exemplo).
        </p>
      </div>
      <Link href="/" className="mt-8 text-white hover:text-purple-200 transition-colors">
        &larr; Voltar para a página inicial
      </Link>
    </div>
  );
}

