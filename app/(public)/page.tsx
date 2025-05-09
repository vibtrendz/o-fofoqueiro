`use client`;

import React, { useEffect, useState, useMemo } from 'react';
import PostCard from '@/components/common/PostCard';
import { Post } from '@/models/post';
import { db } from '@/lib/firebase'; // Import db from firebase config
import { collection, getDocs, query, orderBy, where, Timestamp } from 'firebase/firestore'; 

// Mock data for initial UI development - WILL BE REMOVED
// const mockPosts: Post[] = [ ... ]; // Keep for reference if needed during transition

type CategoryFilter = 'Todas' | 'Fofoca Nacional' | 'Fofoca Internacional';

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('Todas');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const postsCollection = collection(db, 'posts');
        let q;
        if (selectedCategory === 'Todas') {
          q = query(postsCollection, orderBy('date', 'desc'));
        } else {
          q = query(postsCollection, where('category', '==', selectedCategory), orderBy('date', 'desc'));
        }
        
        const postSnapshot = await getDocs(q);
        const postsList = postSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // Convert Firestore Timestamp to ISO string for date consistency if needed, or handle in PostCard
            date: data.date instanceof Timestamp ? data.date.toDate().toISOString() : data.date,
          } as Post;
        });
        setPosts(postsList);

      } catch (err) {
        console.error("Erro ao buscar posts: ", err);
        setError('Não foi possível carregar as fofocas. Tente novamente mais tarde.');
      }
      setLoading(false);
    };

    fetchPosts();
  }, [selectedCategory]); // Refetch when selectedCategory changes

  const featuredPost = useMemo(() => posts.find(post => post.isFeatured), [posts]);
  
  // Regular posts are those not featured, already filtered by category in the fetch query
  const regularPosts = useMemo(() => posts.filter(post => !post.isFeatured), [posts]);

  const handleCategoryChange = (category: CategoryFilter) => {
    setSelectedCategory(category);
    // Data will be refetched due to useEffect dependency on selectedCategory
  };

  if (loading) {
    return <div className="text-center py-10 text-pink-600">Carregando as fofocas mais quentes... 🔥</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-pink-50 min-h-screen">
      {/* Fofoqueiro do Dia Section */}
      {featuredPost && (
        <section className="mb-12 p-6 bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl shadow-2xl text-white">
          <h2 className="text-4xl font-bold mb-4 text-center">👑 Fofoqueiro do Dia 👑</h2>
          <div className="md:flex md:items-center">
            {featuredPost.imageUrl && (
              <div className="md:w-1/2 mb-4 md:mb-0 md:mr-6 relative h-64 md:h-auto">
                <img 
                  src={featuredPost.imageUrl} 
                  alt={featuredPost.title} 
                  className="rounded-lg shadow-lg object-cover w-full h-full"
                />
              </div>
            )}
            <div className="md:w-1/2">
              <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mb-2 ${featuredPost.category === 'Fofoca Nacional' ? 'bg-pink-200 text-pink-800' : 'bg-purple-200 text-purple-800'}`}>
                {featuredPost.category}
              </span>
              <h3 className="text-3xl font-semibold mb-2">{featuredPost.title}</h3>
              <p className="text-sm opacity-80 mb-3">{new Date(featuredPost.date).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p className="text-lg mb-4">{featuredPost.content.substring(0,150)}...</p>
              <a href={`/noticia/${featuredPost.slug}`} className="inline-block bg-white text-pink-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition duration-300">
                Ler Mais &rarr;
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Filtros e Título da Seção de Posts */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-center">
        <h2 className="text-3xl font-bold text-pink-700 mb-4 sm:mb-0">Últimas Fofocas</h2>
        <div className="flex space-x-2">
          {(['Todas', 'Fofoca Nacional', 'Fofoca Internacional'] as CategoryFilter[]).map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 
                          ${selectedCategory === cat 
                            ? 'bg-pink-500 text-white shadow-md'
                            : 'bg-white text-pink-500 hover:bg-pink-100 border border-pink-300'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Feed de Postagens */}
      {regularPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 py-10">Nenhuma fofoca encontrada para esta categoria. Que pena! 😥</p>
      )}
      
      {/* TODO: Barra de Busca e Newsletter (implementar com Firebase if needed) */}
    </div>
  );
}

