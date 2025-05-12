"use client";

import React, { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import PostForm from '@/components/admin/PostForm';
import { Post } from '@/models/post';
// import { db } from '@/lib/firebase'; // To be used later
// import { doc, getDoc } from 'firebase/firestore'; // To be used later

// Mock data - same as in HomePage for now, or a function to find a specific post
const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Celebridade Nacional Vista em Evento Exclusivo!',
    slug: 'celebridade-nacional-evento-exclusivo',
    category: 'Fofoca Nacional',
    date: new Date().toISOString(),
    thumbnailUrl: 'https://via.placeholder.com/300x200/FFC0CB/000000?Text=Fofoca+Nacional+1',
    imageUrl: 'https://via.placeholder.com/800x600/FFC0CB/000000?Text=Fofoca+Nacional+1',
    content: 'Detalhes picantes sobre a aparição surpresa da celebridade em um evento super exclusivo no Rio de Janeiro. Fontes indicam que a estrela estava acompanhada de um novo affair, aumentando os rumores sobre sua vida amorosa. O look escolhido também deu o que falar, uma combinação ousada que dividiu opiniões nas redes sociais. A fofoca completa, você só encontra aqui!',
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Astro Internacional Confirma Novo Romance',
    slug: 'astro-internacional-novo-romance',
    category: 'Fofoca Internacional',
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    thumbnailUrl: 'https://via.placeholder.com/300x200/D8BFD8/000000?Text=Fofoca+Internacional+1',
    imageUrl: 'https://via.placeholder.com/800x600/D8BFD8/000000?Text=Fofoca+Internacional+1',
    content: 'Fontes próximas revelam tudo sobre o novo casal do momento em Hollywood! O ator, conhecido por seus papéis em filmes de ação, foi visto de mãos dadas com uma famosa modelo durante um passeio romântico por Paris. As fotos já circulam pela internet e os fãs estão eufóricos com a novidade. Será que teremos um novo casamento badalado em breve?',
    content_en: 'Sources close to the star reveal everything about the new power couple in Hollywood! The actor, known for his roles in action films, was seen holding hands with a famous model during a romantic stroll through Paris. Photos are already circulating on the internet and fans are euphoric with the news. Will we have a new celebrity wedding soon?',
  },
  {
    id: '3',
    title: 'Polêmica nos Bastidores da Nova Novela Brasileira',
    slug: 'polemica-bastidores-nova-novela',
    category: 'Fofoca Nacional',
    date: new Date(Date.now() - 172800000).toISOString(), // Two days ago
    thumbnailUrl: 'https://via.placeholder.com/300x200/FFC0CB/000000?Text=Fofoca+Nacional+2',
    imageUrl: 'https://via.placeholder.com/800x600/FFC0CB/000000?Text=Fofoca+Nacional+2',
    content: 'Uma briga feia teria acontecido entre dois atores do elenco principal da próxima novela das nove. Os motivos ainda são desconhecidos, mas testemunhas afirmam que o clima ficou pesado e a gravação precisou ser interrompida. A emissora ainda não se pronunciou sobre o ocorrido, mas os burburinhos nos corredores são intensos.',
  },
];

const getMockPostById = (id: string): Post | undefined => {
  return mockPosts.find(p => p.id === id);
};

export default function EditPostPage() {
  const params = useParams();
  const postId = params.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) {
      setError('ID da postagem não encontrado.');
      setLoading(false);
      return;
    }

    const fetchPostDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO: Replace with actual Firebase call to fetch post by ID
        // const postRef = doc(db, 'posts', postId);
        // const postSnap = await getDoc(postRef);
        // if (postSnap.exists()) {
        //   setPost({ id: postSnap.id, ...postSnap.data() } as Post);
        // } else {
        //   setError('Fofoca não encontrada para edição.');
        // }

        // Using mock data for now
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
        const foundPost = getMockPostById(postId);
        if (foundPost) {
          setPost(foundPost);
        } else {
          setError('Fofoca não encontrada para edição.');
        }
      } catch (err) {
        console.error("Erro ao buscar detalhes do post:", err);
        setError('Ops! Algo deu errado ao tentar carregar os dados da fofoca.');
      }
      setLoading(false);
    };

    fetchPostDetails();
  }, [postId]);

  if (loading) {
    return <div className="text-center py-20">Carregando dados da fofoca para edição... 📝</div>;
  }

  if (error) {
    // Could redirect or show a more specific error component
    if (error.includes('Fofoca não encontrada')) {
        notFound();
    }
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  if (!post) {
    return notFound(); // Should be caught by error state, but as a fallback
  }

  return (
    <div>
      <PostForm postToEdit={post} postId={postId} />
    </div>
  );
}

