import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Post } from '@/models/post'; // Assuming models are in @/models

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  // Helper to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Format date (basic example, consider using a library like date-fns for more complex formatting)
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // fallback to original string if parsing fails
    }
  };

  return (
    <Link href={`/noticia/${post.slug}`} className="block group">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {post.thumbnailUrl && (
          <div className="relative w-full h-48">
            <Image
              src={post.thumbnailUrl}
              alt={`Thumbnail para ${post.title}`}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <div className="p-4">
          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mb-2 ${post.category === 'Fofoca Nacional' ? 'bg-pink-200 text-pink-800' : 'bg-purple-200 text-purple-800'}">
            {post.category}
          </span>
          <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-pink-600 transition-colors duration-300">
            {truncateText(post.title, 60)}
          </h3>
          <p className="text-xs text-gray-500 mb-2">{formatDate(post.date)}</p>
          {/* Placeholder for a short description or excerpt if available */}
          {/* <p className="text-sm text-gray-600">{truncateText(post.content, 100)}</p> */}
        </div>
      </div>
    </Link>
  );
};

export default PostCard;

