"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Post } from '@/models/post'; // Assuming models are in @/models
// import { db } from '@/lib/firebase'; // To be used later
// import { collection, getDocs, deleteDoc, doc, orderBy } from 'firebase/firestore'; // To be used later
import { PlusCircle, Edit3, Trash2 } from 'lucide-react'; // Using lucide-react for icons

// Mock data for initial UI development
const mockAdminPosts: Post[] = [
  {
    id: '1',
    title: 'Celebridade Nacional Vista em Evento Exclusivo!',
    slug: 'celebridade-nacional-evento-exclusivo',
    category: 'Fofoca Nacional',
    date: new Date().toISOString(),
    imageUrl: '', // Not strictly needed for admin list view, but part of model
    content: '...',
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Astro Internacional Confirma Novo Romance',
    slug: 'astro-internacional-novo-romance',
    category: 'Fofoca Internacional',
    date: new Date(Date.now() - 86400000).toISOString(),
    imageUrl: '',
    content: '...',
  },
  {
    id: '3',
    title: 'Polêmica nos Bastidores da Nova Novela Brasileira',
    slug: 'polemica-bastidores-nova-novela',
    category: 'Fofoca Nacional',
    date: new Date(Date.now() - 172800000).toISOString(),
    imageUrl: '',
    content: '...',
  },
];

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO: Replace with actual Firebase call to fetch all posts
        // const postsCollection = collection(db, 'posts');
        // const q = query(postsCollection, orderBy('date', 'desc'));
        // const postSnapshot = await getDocs(q);
        // const postsList = postSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
        // setPosts(postsList);

        // Using mock data for now
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
        setPosts(mockAdminPosts);

      } catch (err) {
        console.error("Erro ao buscar posts para o admin: ", err);
        setError('Não foi possível carregar as postagens. Tente novamente mais tarde.');
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const handleDeletePost = async (postId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta fofoca? Esta ação não pode ser desfeita.')) {
      setLoading(true);
      try {
        // TODO: Implement Firebase deleteDoc
        // await deleteDoc(doc(db, 'posts', postId));
        // setPosts(posts.filter(post => post.id !== postId)); // Update UI
        
        // Mock delete
        await new Promise(resolve => setTimeout(resolve, 300));
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
        alert('Post excluído (mock)!');

      } catch (err) {
        console.error("Erro ao excluir post: ", err);
        setError('Erro ao excluir postagem. Tente novamente.');
      }
      setLoading(false);
    }
  };

  if (loading && posts.length === 0) {
    return <div className="text-center py-10">Carregando postagens...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-pink-700">Gerenciar Fofocas</h2>
        <Link href="/admin/posts/new" className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition-colors duration-200">
          <PlusCircle size={20} className="mr-2" />
          Nova Fofoca
        </Link>
      </div>

      {posts.length === 0 && !loading ? (
        <p className="text-gray-600 text-center py-5">Nenhuma fofoca cadastrada ainda. Que tal adicionar a primeira?</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destaque</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-pink-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-xs" title={post.title}>{post.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.category === 'Fofoca Nacional' ? 'bg-pink-100 text-pink-800' : 'bg-purple-100 text-purple-800'}`}>
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(post.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.isFeatured ? <span className="text-yellow-500">⭐ Sim</span> : 'Não'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link href={`/admin/posts/${post.id}/edit`} className="text-indigo-600 hover:text-indigo-900 inline-flex items-center">
                      <Edit3 size={18} className="mr-1" /> Editar
                    </Link>
                    <button 
                      onClick={() => handleDeletePost(post.id)} 
                      disabled={loading}
                      className="text-red-600 hover:text-red-900 inline-flex items-center disabled:opacity-50"
                    >
                      <Trash2 size={18} className="mr-1" /> Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

