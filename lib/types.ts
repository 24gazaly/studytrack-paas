export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  course: string;
  description?: string;
  deadline?: string;
  priority: TaskPriority;
  status: TaskStatus;
  attachment_url?: string | null;
  attachment_name?: string | null;
  created_at?: string;
}

export interface PaaSStatus {
  service: 'Vercel' | 'Supabase' | 'Cloudinary' | 'GitHub';
  role: string;
  category: 'Compute & Hosting' | 'Database (SQL)' | 'Media Storage' | 'Version Control & CI/CD';
  connected: boolean;
  message: string;
  details?: string;
}
