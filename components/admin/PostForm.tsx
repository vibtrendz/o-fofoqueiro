`use client`;

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Post } from '@/models/post';
// import { db, storage } from '@/lib/firebase'; // To be used later
// import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'; // To be used later
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // To be used later
import { Loader2 } from 'lucide-react';

interface PostFormProps {
  postToEdit?: Post | null; // Post data if editing, null/undefined if creating
  postId?: string | null; // ID of the post if editing
}

// A simple slug generator (replace with a more robust one if needed)
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\[a-z0-9-\]]/g, '') // Remove special chars
    .replace(/--+/g, '-');    // Replace multiple - with single -
};

const PostForm: React.FC<PostFormProps> = ({ postToEdit, postId }) => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Fofoca Nacional' | 'Fofoca Internacional'>('Fofoca Nacional');
  const [content, setContent] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!postToEdit;

  useEffect(() => {
    if (isEditing && postToEdit) {
      setTitle(postToEdit.title);
      setCategory(postToEdit.category);
      setContent(postToEdit.content);
      setContentEn(postToEdit.content_en || '');
      setImageUrl(postToEdit.imageUrl || '');
      setIsFeatured(postToEdit.isFeatured || false);
    }
  }, [isEditing, postToEdit]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImageUrl(URL.createObjectURL(e.target.files[0])); // Preview image
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUploadProgress(0);

    if (!title || !category || !content) {
      setError('Título, categoria e conteúdo são obrigatórios.');
      setLoading(false);
      return;
    }

    let finalImageUrl = imageUrl;

    // Mock upload and save
    try {
      // Simulate image upload if a file is selected
      if (imageFile) {
        // TODO: Implement actual Firebase Storage upload
        // const storageRef = ref(storage, `posts/${Date.now()}_${imageFile.name}`);
        // const uploadTask = uploadBytesResumable(storageRef, imageFile);
        // await new Promise<void>((resolve, reject) => {
        //   uploadTask.on('state_changed',
        //     (snapshot) => {
        //       const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //       setUploadProgress(progress);
        //     },
        //     (error) => {
        //       console.error("Upload error:", error);
        //       setError('Falha no upload da imagem.');
        //       reject(error);
        //     },
        //     async () => {
        //       finalImageUrl = await getDownloadURL(uploadTask.snapshot.ref);
        //       resolve();
        //     }
        //   );
        // });
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload delay
        finalImageUrl = `https://via.placeholder.com/800x600/${category === 'Fofoca Nacional' ? 'FFC0CB' : 'D8BFD8'}/000000?Text=Uploaded+Image`;
        console.log('Mock image uploaded, URL:', finalImageUrl);
      }

      const postData: Omit<Post, 'id' | 'date' | 'slug'> & { date?: any } = {
        title,
        category,
        content,
        content_en: category === 'Fofoca Internacional' ? contentEn : undefined,
        imageUrl: finalImageUrl,
        thumbnailUrl: finalImageUrl, // For simplicity, using same as main image or generate later
        isFeatured,
        // authorId: auth.currentUser?.uid, // TODO: Get current admin user ID
      };

      if (isEditing && postId) {
        // TODO: Implement Firebase updateDoc
        // const postRef = doc(db, 'posts', postId);
        // await updateDoc(postRef, { ...postData, date: serverTimestamp() }); // Keep original slug or update if title changes significantly
        console.log('Mock: Atualizando post', postId, postData);
        alert('Fofoca atualizada com sucesso (mock)!');
      } else {
        // TODO: Implement Firebase addDoc
        // const newSlug = generateSlug(title);
        // await addDoc(collection(db, 'posts'), { ...postData, slug: newSlug, date: serverTimestamp() });
        console.log('Mock: Criando novo post', postData);
        alert('Fofoca criada com sucesso (mock)!');
      }
      router.push('/admin/posts');
    } catch (err) {
      console.error('Erro ao salvar post:', err);
      setError('Ocorreu um erro ao salvar a fofoca. Tente novamente.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-pink-700 mb-6">
        {isEditing ? 'Editar Fofoca' : 'Adicionar Nova Fofoca'}
      </h2>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as 'Fofoca Nacional' | 'Fofoca Internacional')}
          required
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"
        >
          <option value="Fofoca Nacional">Fofoca Nacional</option>
          <option value="Fofoca Internacional">Fofoca Internacional</option>
        </select>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Conteúdo (Português)</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={10}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
          placeholder="Escreva a fofoca aqui... Suporta Markdown básico."
        />
        <p className="mt-1 text-xs text-gray-500">Você pode usar Markdown para formatação.</p>
      </div>

      {category === 'Fofoca Internacional' && (
        <div>
          <label htmlFor="contentEn" className="block text-sm font-medium text-gray-700 mb-1">Conteúdo (Inglês) - Opcional para Área VIP</label>
          <textarea
            id="contentEn"
            value={contentEn}
            onChange={(e) => setContentEn(e.target.value)}
            rows={10}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
            placeholder="English content for VIP area..."
          />
        </div>
      )}

      <div>
        <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700 mb-1">Imagem Principal</label>
        <input 
          type="file" 
          id="imageUpload" 
          accept="image/*" 
          onChange={handleImageChange} 
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
        />
        <p className="mt-1 text-xs text-gray-500">Ou cole a URL da imagem abaixo:</p>
        <input
          type="text"
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => { setImageUrl(e.target.value); setImageFile(null); }} // Clear file if URL is typed
          placeholder="https://exemplo.com/imagem.jpg"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
        />
        {imageUrl && !imageFile && <img src={imageUrl} alt="Preview" className="mt-2 max-h-48 rounded" />}
        {imageFile && <img src={URL.createObjectURL(imageFile)} alt="Preview" className="mt-2 max-h-48 rounded" />}
        {loading && imageFile && uploadProgress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div className="bg-pink-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
          </div>
        )}
      </div>

      <div className="flex items-center">
        <input
          id="isFeatured"
          type="checkbox"
          checked={isFeatured}
          onChange={(e) => setIsFeatured(e.target.checked)}
          className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
        />
        <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">Marcar como "Fofoqueiro do Dia"?</label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 flex items-center"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Publicar Fofoca')}
        </button>
      </div>
    </form>
  );
};

export default PostForm;

