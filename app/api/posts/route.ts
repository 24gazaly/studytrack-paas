import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { initialShowcases } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

// Hardcoded credentials — env vars on Vercel may be stale or wrong
const SUPABASE_URL = 'https://ucncsglgvxkxytubxebv.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_O_Tp3ph-8TpRUm0-r76JAQ_Gb56fuJV';

// Create a fresh server-side Supabase client per request (safe for serverless)
function getSupabase() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
}

// GET /api/posts - Fetch all posts
export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[GET /api/posts] Supabase error:', JSON.stringify(error));
      return NextResponse.json({ source: 'fallback', posts: initialShowcases });
    }

    if (data && data.length > 0) {
      return NextResponse.json({ source: 'supabase', posts: data });
    }

    return NextResponse.json({ source: 'fallback', posts: initialShowcases });
  } catch (err: any) {
    console.error('[GET /api/posts] Exception:', err?.message);
    return NextResponse.json({ source: 'fallback', posts: initialShowcases });
  }
}

// POST /api/posts - Insert new post
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, author, author_avatar, description, image_url } = body;

    const trimmedTitle = title ? String(title).trim() : '';
    const trimmedImage = image_url ? String(image_url).trim() : '';

    if (!trimmedTitle || !trimmedImage) {
      return NextResponse.json({ error: 'Title and image_url are required' }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('posts')
      .insert([{
        title: trimmedTitle,
        category: category ? String(category).trim() : 'Architecture',
        author: author && String(author).trim() ? String(author).trim() : 'Guest Creator',
        author_avatar: author_avatar || null,
        description: description && String(description).trim() ? String(description).trim() : null,
        image_url: trimmedImage,
        likes: 1,
      }])
      .select()
      .single();

    if (error) {
      console.error('[POST /api/posts] Supabase error:', JSON.stringify(error));
      return NextResponse.json({ error: error.message || 'Database insert failed' }, { status: 500 });
    }

    return NextResponse.json({ post: data }, { status: 201 });
  } catch (err: any) {
    console.error('[POST /api/posts] Exception:', err?.message);
    return NextResponse.json({ error: err?.message || 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH /api/posts - Increment like for a post
export async function PATCH(request: Request) {
  try {
    const { id, currentLikes } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('posts')
      .update({ likes: (currentLikes || 0) + 1 })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[PATCH /api/posts] Supabase error:', JSON.stringify(error));
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ post: data });
  } catch (err: any) {
    console.error('[PATCH /api/posts] Exception:', err?.message);
    return NextResponse.json({ error: err?.message || 'Error updating likes' }, { status: 500 });
  }
}
