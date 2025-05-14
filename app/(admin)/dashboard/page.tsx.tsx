"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface Post {
  id: string;
  title: string;
  category: string;
  // Adicione outros campos que você espera de um post
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [totalPosts, setTotalPosts] = useState(0);
  const [recentActivity, setRecentActivity] = useState<string[]>([]); // Apenas um exemplo

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const postsCollection = collection(db, 'posts');
        const postSnapshot = await getDocs(postsCollection);
        setTotalPosts(postSnapshot.size);
        // Exemplo de atividade recente (poderia ser mais elaborado)
        const recent = postSnapshot.docs.slice(0, 3).map(doc => `Postagem recente: ${doc.data().title}`);
        setRecentActivity(recent);
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
        // Tratar erro, talvez mostrar uma mensagem para o usuário
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p>Carregando...</p></div>;
  }

  if (!user) {
    return null; // Ou uma mensagem de redirecionamento
  }

  return (
    <div className="container mx-auto p-4 md:p-8 bg-pink-50 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold text-pink-600 mb-8">Painel Administrativo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Total de Postagens</h2>
          <p className="text-3xl font-bold text-pink-500">{totalPosts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Usuário Logado</h2>
          <p className="text-lg text-gray-600">{user.email}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Atividade Recente (Exemplo)</h2>
        {recentActivity.length > 0 ? (
          <ul className="space-y-2">
            {recentActivity.map((activity, index) => (
              <li key={index} className="text-gray-600 p-2 bg-pink-100 rounded">
                {activity}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Nenhuma atividade recente para mostrar.</p>
        )}
      </div>

      {/* Adicionar mais seções e funcionalidades conforme necessário */}
      {/* Por exemplo, links rápidos para criar postagem, gerenciar usuários (se aplicável), etc. */}
      <div className="mt-8">
        <button 
          onClick={() => router.push('/admin/posts/new')}
          className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg shadow focus:outline-none focus:shadow-outline"
        >
          Nova Postagem
        </button>
      </div>
    </div>
  );
}

