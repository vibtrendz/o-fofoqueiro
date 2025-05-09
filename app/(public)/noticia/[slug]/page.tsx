`use client`;

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Post } from '@/models/post';
import { db } from '@/lib/firebase'; // Import db from firebase config
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore'; 
import { notFound, useParams } from 'next/navigation';

// Basic Share Buttons component (can be moved to components/common later)
const ShareButtons: React.FC<{ title: string; url: string }> = ({ title, url }) => {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  return (
    <div className="flex space-x-3 mt-6">
      <a 
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank" 
        rel="noopener noreferrer"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        Facebook
      </a>
      <a 
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank" 
        rel="noopener noreferrer"
        className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors duration-200"
      >
        Twitter
      </a>
      <a 
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank" 
        rel="noopener noreferrer"
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
      >
        WhatsApp
      </a>
    </div>
  );
};

export default function NoticiaPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
        setError("Slug da notícia não fornecido.");
        setLoading(false);
        return;
    }

    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const postsRef = collection(db, "posts");
        const q = query(postsRef, where("slug", "==", slug));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const data = doc.data();
          setPost({
            id: doc.id,
            ...data,
            date: data.date instanceof Timestamp ? data.date.toDate().toISOString() : data.date,
          } as Post);
        } else {
          setError("Fofoca não encontrada! Parece que essa história sumiu... 🕵️‍♀️");
        }
      } catch (err) {
        console.error("Erro ao buscar post:", err);
        setError("Ops! Algo deu errado ao tentar carregar esta fofoca.");
      }
      setLoading(false);
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return <div className="text-center py-20 text-pink-600">Procurando os detalhes dessa fofoca... 🤫</div>;
  }

  if (error) {
    if (error.includes("Fofoca não encontrada")) {
        notFound();
    }
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  if (!post) {
    return notFound();
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Function to render content safely (basic example, consider a Markdown library for complex HTML)
  const renderContent = (htmlContent: string) => {
    // A more robust solution would use a library like DOMPurify if content comes from WYSIWYG
    // For Markdown, use a Markdown renderer like react-markdown
    return { __html: htmlContent.replace(/\n/g, '<br />') }; 
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-pink-50 min-h-screen">
      <article className="bg-white p-6 sm:p-8 rounded-xl shadow-xl max-w-3xl mx-auto">
        <header className="mb-6">
          <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mb-3 ${post.category === 'Fofoca Nacional' ? 'bg-pink-200 text-pink-800' : 'bg-purple-200 text-purple-800'}`}>
            {post.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-pink-700 mb-2">{post.title}</h1>
          <p className="text-sm text-gray-500">
            Publicado em: {new Date(post.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
        </header>

        {post.imageUrl && (
          <div className="relative w-full h-64 sm:h-80 md:h-96 mb-6 rounded-lg overflow-hidden shadow-md">
            <Image
              src={post.imageUrl}
              alt={`Imagem principal para ${post.title}`}
              layout="fill"
              objectFit="cover"
              priority // Consider adding priority for LCP images
            />
          </div>
        )}

        <div 
          className="prose prose-pink max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={renderContent(post.content)} 
        />
        
        <ShareButtons title={post.title} url={currentUrl} />

      </article>
    </div>
  );
}

