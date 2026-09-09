-- =================================================================
-- StudyTrack PaaS - Supabase Database Schema & Seed Data
-- =================================================================
-- Run this SQL in your Supabase Dashboard:
-- 1. Login to https://supabase.com
-- 2. Go to your Project -> SQL Editor -> New Query
-- 3. Paste this script and click "Run"
-- =================================================================

-- 1. Create Tasks Table
create table if not exists public.tasks (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    course text not null,
    description text,
    deadline timestamptz,
    priority text default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
    status text default 'todo' check (status in ('todo', 'in_progress', 'completed')),
    attachment_url text,
    attachment_name text,
    created_at timestamptz default now() not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.tasks enable row level security;

-- 3. Create Public Policies (Allows read, insert, update, delete for demo/anon users)
create policy "Allow anonymous read tasks" 
on public.tasks for select 
to anon, authenticated 
using (true);

create policy "Allow anonymous insert tasks" 
on public.tasks for insert 
to anon, authenticated 
with check (true);

create policy "Allow anonymous update tasks" 
on public.tasks for update 
to anon, authenticated 
using (true)
with check (true);

create policy "Allow anonymous delete tasks" 
on public.tasks for delete 
to anon, authenticated 
using (true);

-- 4. Seed Initial Sample Data
insert into public.tasks (title, course, description, deadline, priority, status, attachment_url, attachment_name)
values 
(
    'Implementasi PaaS Vercel & Supabase',
    'Cloud Computing',
    'Menyiapkan arsitektur web berbasis PaaS menggunakan Next.js di Vercel dan PostgreSQL di Supabase.',
    now() + interval '3 days',
    'urgent',
    'in_progress',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    'cloud-architecture-diagram.jpg'
),
(
    'Konfigurasi Cloudinary CDN & Unsigned Preset',
    'Web Architecture',
    'Membuat storage bucket di Cloudinary untuk upload attachment dokumen dan kompresi media real-time.',
    now() + interval '5 days',
    'high',
    'completed',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    'cloudinary-cdn-preview.png'
),
(
    'Rangkuman Bab 4: Database As A Service (DBaaS)',
    'Sistem Basis Data',
    'Membuat rangkuman perbandingan relasional database serverless vs managed cloud instances.',
    now() + interval '7 days',
    'medium',
    'todo',
    null,
    null
);
