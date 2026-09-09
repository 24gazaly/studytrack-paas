-- =================================================================
-- Inspira Creative Showcase - Database Schema & Seed Data
-- =================================================================
-- Run this SQL in your Supabase SQL Editor:
-- https://supabase.com -> Project -> SQL Editor -> Run
-- =================================================================

create table if not exists public.posts (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    category text not null,
    author text default 'Guest Creator',
    author_avatar text,
    description text,
    image_url text not null,
    likes integer default 0,
    created_at timestamptz default now() not null
);

alter table public.posts enable row level security;

create policy "Allow public access to posts" 
on public.posts for all 
to anon, authenticated 
using (true) 
with check (true);

-- Initial seed showcases
insert into public.posts (title, category, author, author_avatar, description, image_url, likes)
values 
(
    'Minimalist Nordic Pavilion',
    'Architecture',
    'Elena Rostova',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    'A study on natural timber reflections and diffuse daylighting in contemporary Scandinavian pavilions.',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
    142
),
(
    'Cyberpunk Neon Rain',
    'Photography',
    'Kenji Sato',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    'Shinjuku alleyways during a heavy monsoon evening, capturing reflections on asphalt.',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
    289
),
(
    'Kinetic Flow Mobile App Concept',
    'UI/UX Design',
    'Sarah Chen',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    'Experimental gestural navigation system designed for next-generation spatial computing interfaces.',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
    195
),
(
    'Iridescent Glass Sculptures',
    '3D Art',
    'Marcus Vance',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    'Procedural refraction simulations rendered using spectral dispersion shaders in Octane.',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    310
);
