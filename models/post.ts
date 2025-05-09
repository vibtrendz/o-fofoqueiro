export interface Post {
  id: string;
  title: string;
  slug: string;
  category: 'Fofoca Nacional' | 'Fofoca Internacional';
  date: string; // Should be a Firestore Timestamp or ISO string, formatted on display
  thumbnailUrl?: string;
  imageUrl: string;
  content: string; // Markdown or HTML
  content_en?: string; // For VIP area
  isFeatured?: boolean; // For "Fofoqueiro do Dia"
  authorId?: string; // Admin who posted
}

