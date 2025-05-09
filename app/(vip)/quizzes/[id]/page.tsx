`use client`;

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import { Post } from '@/models/post'; // Adjust path as needed
import { ChevronLeft, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

// Mock function to get a post by slug (replace with actual data fetching)
const getMockPostBySlug = (slug: string): Post | undefined => {
  const mockPosts: Post[] = [
    {
      id: '2',
      title: 'Astro Internacional Confirma Novo Romance',
      slug: 'astro-internacional-novo-romance',
      category: 'Fofoca Internacional',
      date: new Date(Date.now() - 86400000).toISOString(),
      imageUrl: '',
      content: 'Conteúdo em português...',
      content_en: 'Sources close to the star reveal everything about the new power couple in Hollywood! The actor, known for his roles in action films, was seen holding hands with a famous model during a romantic stroll through Paris. Photos are already circulating on the internet and fans are euphoric with the news. Will we have a new celebrity wedding soon?',
    },
    {
      id: '4',
      title: 'Cantora Pop Lança Clipe Inovador e Quebra a Internet',
      slug: 'cantora-pop-clipe-inovador',
      category: 'Fofoca Internacional',
      date: new Date(Date.now() - 259200000).toISOString(),
      imageUrl: '',
      content: 'Conteúdo em português...',
      content_en: 'The artist\'s new visual work is making waves on social media. With a cinematographic production and a powerful message, the music video has already accumulated millions of views in just a few hours. Experts point out that this could be one of the biggest releases of the year in the pop music world.',
    },
  ];
  return mockPosts.find(p => p.slug === slug);
};

interface QuizQuestion {
  id: string;
  question_pt: string;
  question_en: string;
  options: { id: string; text_pt: string; text_en: string }[];
  correctOptionId: string;
  explanation_pt?: string;
  explanation_en?: string;
}

// Mock quiz data for a post slug
const mockQuizzes: { [postSlug: string]: QuizQuestion[] } = {
  'astro-internacional-novo-romance': [
    {
      id: 'q1',
      question_pt: 'Qual expressão significa \'casal poderoso\' em inglês?',
      question_en: 'Which expression means \'casal poderoso\' in English?',
      options: [
        { id: 'o1', text_pt: 'Strong Pair', text_en: 'Strong Pair' },
        { id: 'o2', text_pt: 'Power Couple', text_en: 'Power Couple' },
        { id: 'o3', text_pt: 'Influential Duo', text_en: 'Influential Duo' },
      ],
      correctOptionId: 'o2',
      explanation_pt: '\'Power couple\' é a expressão comum para descrever um casal influente e bem-sucedido.',
      explanation_en: '\'Power couple\' is the common expression to describe an influential and successful couple.',
    },
    {
      id: 'q2',
      question_pt: 'O que significa \'stroll\'?',
      question_en: 'What does \'stroll\' mean?',
      options: [
        { id: 'o1', text_pt: 'Corrida rápida', text_en: 'A quick run' },
        { id: 'o2', text_pt: 'Discussão acalorada', text_en: 'A heated argument' },
        { id: 'o3', text_pt: 'Passeio, caminhada tranquila', text_en: 'A leisurely walk' },
      ],
      correctOptionId: 'o3',
      explanation_pt: '\'Stroll\' refere-se a uma caminhada calma e prazerosa.',
      explanation_en: '\'Stroll\' refers to a calm and enjoyable walk.',
    },
  ],
  'cantora-pop-clipe-inovador': [
    {
      id: 'q1',
      question_pt: 'O que significa a expressão \'making waves\'?',
      question_en: 'What does the expression \'making waves\' mean?',
      options: [
        { id: 'o1', text_pt: 'Fazendo ondas no mar', text_en: 'Making waves in the sea' },
        { id: 'o2', text_pt: 'Causando impacto, agitando', text_en: 'Causing impact, stirring things up' },
        { id: 'o3', text_pt: 'Criando problemas', text_en: 'Creating problems' },
      ],
      correctOptionId: 'o2',
      explanation_pt: '\'Making waves\' significa causar um grande impacto ou chamar muita atenção.',
      explanation_en: '\'Making waves\' means to cause a big impact or draw a lot of attention.',
    },
  ],
};

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const postSlug = params.id as string; // Assuming the route is /quizzes/[id] where id is the post slug

  const [post, setPost] = useState<Post | null>(null);
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (postSlug) {
      const foundPost = getMockPostBySlug(postSlug);
      const foundQuiz = mockQuizzes[postSlug];
      if (foundPost && foundQuiz) {
        setPost(foundPost);
        setQuiz(foundQuiz);
      } else {
        // Handle case where post or quiz is not found
        notFound();
      }
      setLoading(false);
    } else {
      setLoading(false);
      notFound(); // No slug provided
    }
  }, [postSlug]);

  const handleOptionSelect = (questionId: string, optionId: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
    // TODO: Save quiz results/progress for the user
  };

  const handleNextQuestion = () => {
    if (quiz && currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmitQuiz();
    }
  };
  
  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  if (loading) {
    return <div className="text-center py-20 text-purple-700">Carregando quiz... 🤔</div>;
  }

  if (!post || !quiz) {
    return notFound();
  }

  const currentQuestion = quiz[currentQuestionIndex];
  const score = quiz.reduce((acc, q) => 
    selectedAnswers[q.id] === q.correctOptionId ? acc + 1 : acc, 0
  );

  if (showResults) {
    return (
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-purple-700 mb-4">Resultados do Quiz!</h2>
        <p className="text-xl text-gray-700 mb-6">
          Você acertou <span className="font-bold text-green-500">{score}</span> de <span className="font-bold">{quiz.length}</span> perguntas.
        </p>
        <div className="space-y-4 mb-8">
          {quiz.map(q => (
            <div key={q.id} className={`p-4 rounded-lg border ${selectedAnswers[q.id] === q.correctOptionId ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'}`}>
              <p className="font-semibold text-gray-800 text-left">{q.question_pt}</p>
              <p className="text-sm text-gray-600 text-left mb-1">Sua resposta: {q.options.find(opt => opt.id === selectedAnswers[q.id])?.text_pt || 'Não respondida'}</p>
              {selectedAnswers[q.id] !== q.correctOptionId && (
                <p className="text-sm text-green-700 font-medium text-left">Resposta correta: {q.options.find(opt => opt.id === q.correctOptionId)?.text_pt}</p>
              )}
              {q.explanation_pt && <p className="text-xs text-gray-500 mt-2 text-left"><em>{q.explanation_pt}</em></p>}
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <button 
            onClick={handleRestartQuiz}
            className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors duration-200"
          >
            <RotateCcw size={18} className="mr-2" /> Tentar Novamente
          </button>
          <button 
            onClick={() => router.push('/vip/learn')}
            className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors duration-200"
          >
            <ChevronLeft size={18} className="mr-2" /> Voltar para Fofocas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-2xl mx-auto">
      <button onClick={() => router.back()} className="flex items-center text-sm text-purple-600 hover:text-purple-800 mb-6 font-medium">
        <ChevronLeft size={20} className="mr-1" /> Voltar
      </button>
      <h2 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-2">Quiz: {post.title}</h2>
      <p className="text-gray-500 mb-6 text-sm">Teste seus conhecimentos sobre esta fofoca!</p>
      
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Pergunta {currentQuestionIndex + 1} de {quiz.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-pink-500 h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / quiz.length) * 100}%` }}></div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{currentQuestion.question_pt}</h3>
        <p className="text-sm text-gray-500 mb-6"><em>{currentQuestion.question_en}</em></p>
        <div className="space-y-3">
          {currentQuestion.options.map(option => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(currentQuestion.id, option.id)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 
                ${selectedAnswers[currentQuestion.id] === option.id 
                  ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-500 shadow-lg'
                  : 'border-gray-300 hover:border-pink-400 hover:bg-pink-50'}`}
            >
              <span className="font-medium text-gray-700">{option.text_pt}</span>
              <span className="block text-xs text-gray-500"><em>{option.text_en}</em></span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 flex justify-end">
        <button 
          onClick={handleNextQuestion}
          disabled={!selectedAnswers[currentQuestion.id]}
          className="px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentQuestionIndex < quiz.length - 1 ? 'Próxima Pergunta' : 'Ver Resultados'}
        </button>
      </div>
    </div>
  );
}

