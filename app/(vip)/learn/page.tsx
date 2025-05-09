`use client`;

import React, { useEffect, useState, useMemo } from 'react';
import { Post } from '@/models/post';
// import { db } from '@/lib/firebase'; // To be used later
// import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'; // To be used later
import Link from 'next/link';
import { Volume2, Lightbulb, HelpCircle } from 'lucide-react'; // Icons

// Mock data - ensure some posts are 'Fofoca Internacional' and have 'content_en'
const mockVipPosts: Post[] = [
  {
    id: '2',
    title: 'Astro Internacional Confirma Novo Romance',
    slug: 'astro-internacional-novo-romance',
    category: 'Fofoca Internacional',
    date: new Date(Date.now() - 86400000).toISOString(),
    thumbnailUrl: 'https://via.placeholder.com/300x200/D8BFD8/000000?Text=Fofoca+Internacional+1',
    imageUrl: 'https://via.placeholder.com/800x600/D8BFD8/000000?Text=Fofoca+Internacional+1',
    content: 'Fontes próximas revelam tudo sobre o novo casal do momento em Hollywood! O ator, conhecido por seus papéis em filmes de ação, foi visto de mãos dadas com uma famosa modelo durante um passeio romântico por Paris. As fotos já circulam pela internet e os fãs estão eufóricos com a novidade. Será que teremos um novo casamento badalado em breve?',
    content_en: 'Sources close to the star reveal everything about the new power couple in Hollywood! The actor, known for his roles in action films, was seen holding hands with a famous model during a romantic stroll through Paris. Photos are already circulating on the internet and fans are euphoric with the news. Will we have a new celebrity wedding soon?',
  },
  {
    id: '4',
    title: 'Cantora Pop Lança Clipe Inovador e Quebra a Internet',
    slug: 'cantora-pop-clipe-inovador',
    category: 'Fofoca Internacional',
    date: new Date(Date.now() - 259200000).toISOString(),
    thumbnailUrl: 'https://via.placeholder.com/300x200/D8BFD8/000000?Text=Fofoca+Internacional+2',
    imageUrl: 'https://via.placeholder.com/800x600/D8BFD8/000000?Text=Fofoca+Internacional+2',
    content: 'O novo trabalho visual da artista está dando o que falar nas redes sociais. Com uma produção cinematográfica e uma mensagem poderosa, o clipe já acumula milhões de visualizações em poucas horas. Especialistas apontam que este pode ser um dos maiores lançamentos do ano no mundo da música pop.',
    content_en: 'The artist\'s new visual work is making waves on social media. With a cinematographic production and a powerful message, the music video has already accumulated millions of views in just a few hours. Experts point out that this could be one of the biggest releases of the year in the pop music world.',
  },
  {
    id: '5',
    title: 'Diretor Premiado Anuncia Próximo Filme Épico',
    slug: 'diretor-premiado-proximo-filme',
    category: 'Fofoca Internacional',
    date: new Date(Date.now() - 345600000).toISOString(),
    thumbnailUrl: 'https://via.placeholder.com/300x200/D8BFD8/000000?Text=Fofoca+Internacional+3',
    imageUrl: 'https://via.placeholder.com/800x600/D8BFD8/000000?Text=Fofoca+Internacional+3',
    content: 'Após o sucesso de seu último longa, o aclamado diretor revelou detalhes de sua próxima superprodução. O filme, que será uma saga de ficção científica, promete um elenco estrelado e efeitos visuais de ponta. As filmagens devem começar no próximo semestre.',
    content_en: 'After the success of his last feature film, the acclaimed director revealed details of his next blockbuster. The film, which will be a science fiction saga, promises a star-studded cast and cutting-edge visual effects. Filming is expected to begin next semester.',
  },
];

interface VocabularyExplanation {
  term: string;
  explanation_pt: string;
  example_en: string;
  example_pt: string;
}

// Mock vocabulary for a post (e.g., post with id '2')
const mockVocabulary: { [postId: string]: VocabularyExplanation[] } = {
  '2': [
    { term: 'power couple', explanation_pt: 'Casal poderoso, influente.', example_en: 'They are the new power couple in town.', example_pt: 'Eles são o novo casal poderoso da cidade.' },
    { term: 'stroll', explanation_pt: 'Passeio, caminhada tranquila.', example_en: 'They went for a romantic stroll in the park.', example_pt: 'Eles foram dar um passeio romântico no parque.' },
    { term: 'euphoric', explanation_pt: 'Extremamente feliz, eufórico.', example_en: 'Fans were euphoric with the news.', example_pt: 'Os fãs ficaram eufóricos com a notícia.' },
  ],
  '4': [
    { term: 'making waves', explanation_pt: 'Causando impacto, agitando, sendo comentado.', example_en: 'Her new song is making waves in the music industry.', example_pt: 'A nova música dela está agitando a indústria musical.' },
    { term: 'cinematographic', explanation_pt: 'Relativo ao cinema, com qualidade de cinema.', example_en: 'The music video had a cinematographic quality.', example_pt: 'O videoclipe tinha uma qualidade cinematográfica.' },
  ],
};

export default function LearnPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null); // postId of audio playing

  useEffect(() => {
    const fetchVipPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO: Replace with actual Firebase call to fetch 'Fofoca Internacional' posts with 'content_en'
        // const postsCollection = collection(db, 'posts');
        // const q = query(postsCollection, 
        //   where('category', '==', 'Fofoca Internacional'), 
        //   where('content_en', '!=', null), // Ensure English content exists
        //   orderBy('date', 'desc')
        // );
        // const postSnapshot = await getDocs(q);
        // const postsList = postSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
        // setPosts(postsList);

        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        setPosts(mockVipPosts.filter(p => p.category === 'Fofoca Internacional' && p.content_en));
      } catch (err) {
        console.error("Erro ao buscar posts VIP: ", err);
        setError('Não foi possível carregar as fofocas para aprendizado. Tente novamente.');
      }
      setLoading(false);
    };
    fetchVipPosts();
  }, []);

  const handlePlayAudio = (postId: string, text_en: string) => {
    if (playingAudio === postId) {
      // TODO: Pause audio if already playing this one
      speechSynthesis.cancel(); // Simple stop for now
      setPlayingAudio(null);
      return;
    }
    // TODO: Implement actual TTS API call or use browser's SpeechSynthesis
    try {
        speechSynthesis.cancel(); // Cancel any previous speech
        const utterance = new SpeechSynthesisUtterance(text_en);
        utterance.lang = 'en-US';
        utterance.onend = () => setPlayingAudio(null);
        utterance.onerror = (e) => {
            console.error('SpeechSynthesis Error:', e);
            alert('Desculpe, não foi possível reproduzir o áudio.');
            setPlayingAudio(null);
        };
        speechSynthesis.speak(utterance);
        setPlayingAudio(postId);
    } catch (e) {
        alert('Seu navegador não suporta narração de áudio ou ocorreu um erro.');
        console.error('TTS Error:', e);
        setPlayingAudio(null);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-purple-700">Carregando fofocas para você aprender inglês... 🤓</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-12">
      <h1 className="text-4xl font-bold text-purple-700 mb-8 text-center">Aprenda Inglês com as Fofocas do Momento!</h1>
      {posts.length === 0 && (
        <p className="text-center text-gray-600">Nenhuma fofoca internacional fresquinha para aprender hoje. Volte mais tarde! 😉</p>
      )}
      {posts.map(post => (
        <article key={post.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-2xl sm:text-3xl font-semibold text-pink-600 mb-3">{post.title}</h2>
          <p className="text-xs text-gray-500 mb-4">{new Date(post.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-1">🇧🇷 Em Português</h3>
              <p>{post.content}</p>
            </div>
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-1">🇺🇸 Em Inglês</h3>
              <p>{post.content_en}</p>
            </div>
          </div>

          <div className="mt-4 mb-6 flex flex-wrap items-center gap-4">
            <button 
              onClick={() => handlePlayAudio(post.id, post.content_en || '')}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out transform hover:scale-105 
                ${playingAudio === post.id ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
            >
              <Volume2 size={18} className="mr-2" /> 
              {playingAudio === post.id ? 'Parar Áudio' : 'Ouvir em Inglês'}
            </button>
            {/* Placeholder for Vocabulary and Quiz links/buttons */}
            <button className="flex items-center px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out transform hover:scale-105">
              <Lightbulb size={18} className="mr-2" /> Ver Vocabulário
            </button>
          </div>

          {/* Vocabulary Section (Example) */}
          {mockVocabulary[post.id] && (
            <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="text-md font-semibold text-purple-700 mb-3">💡 Vocabulário Chave:</h4>
              <ul className="space-y-2">
                {mockVocabulary[post.id].map(vocab => (
                  <li key={vocab.term} className="text-sm">
                    <strong className="text-purple-600">{vocab.term}:</strong> {vocab.explanation_pt}
                    <br />
                    <em className="text-gray-600">Ex (EN): {vocab.example_en}</em>
                    <br />
                    <em className="text-gray-500">Ex (PT): {vocab.example_pt}</em>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <Link href={`/vip/quizzes/${post.slug}`} className="inline-flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg text-md font-semibold transition-all duration-200 ease-in-out transform hover:scale-105">
              <HelpCircle size={20} className="mr-2" /> Fazer Quiz sobre esta Fofoca!
            </Link>
          </div>

        </article>
      ))}
    </div>
  );
}

