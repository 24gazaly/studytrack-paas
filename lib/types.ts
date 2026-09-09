export type Category =
  | 'All'
  | 'Architecture'
  | 'Photography'
  | 'UI/UX Design'
  | '3D Art'
  | 'Branding';

export interface Showcase {
  id: string;
  title: string;
  category: string;
  author: string;
  author_avatar?: string;
  description?: string;
  image_url: string;
  likes: number;
  created_at?: string;
}
