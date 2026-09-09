import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { initialShowcases } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

// GET /api/posts - Fetch all posts from Supabase with server-level reliability
export async function GET() {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return NextResponse.json({
          source: 'supabase',
          posts: data,
        });
      }

      if (error) {
        console.error('Supabase server GET error:', error);
      }
    } catch (err: any) {
      console.error('Supabase fetch exception:', err);
    }
  }

  // Fallback if Supabase credentials are missing on Vercel or empty
  return NextResponse.json({
    source: 'fallback',
    posts: initialShowcases,
  });
}

// POST /api/posts - Insert new post into Supabase
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, author, author_avatar, description, image_url } = body;

    if (!title || !image_url) {
      return NextResponse.json({ error: 'Title and image_url are required' }, { status: 400 });
    }

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('posts')
        .insert([{
          title,
          category: category || 'Architecture',
          author: author || 'Guest Creator',
          author_avatar: author_avatar || null,
          description: description || null,
          image_url,
          likes: 1,
        }])
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({ post: data }, { status: 201 });
      }

      if (error) {
        console.error('Supabase server POST error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    // Mock fallback response if database not configured
    const mockPost = {
      id: 'post_' + Date.now(),
      title,
      category: category || 'Architecture',
      author: author || 'Guest Creator',
      author_avatar,
      description,
      image_url,
      likes: 1,
      created_at: new Date().toISOString(),
    };
    return NextResponse.json({ post: mockPost }, { status: 201 });
  } catch (err: any) {
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

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('posts')
        .update({ likes: (currentLikes || 0) + 1 })
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({ post: data });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Error updating likes' }, { status: 500 });
  }
}
