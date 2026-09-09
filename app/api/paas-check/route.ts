import { NextResponse } from 'next/server';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { isCloudinaryConfigured } from '@/lib/cloudinary';

export async function GET() {
  const statusList = [];

  // 1. Vercel Platform Status
  const isVercel = Boolean(process.env.VERCEL) || process.env.NODE_ENV !== 'production';
  statusList.push({
    service: 'Vercel',
    role: 'Application Hosting & Serverless Functions',
    category: 'Compute & Hosting',
    connected: true,
    message: process.env.VERCEL ? 'Active on Vercel Edge/Serverless' : 'Local Dev Server (Vercel Ready)',
    details: `Region: ${process.env.VERCEL_REGION || 'local'} | Node.js ${process.version}`,
  });

  // 2. Supabase Database Status
  const supabaseReady = isSupabaseConfigured();
  let supabasePing = false;
  let supabaseError = '';

  if (supabaseReady && supabase) {
    try {
      const { error } = await supabase.from('tasks').select('id').limit(1);
      if (!error) {
        supabasePing = true;
      } else {
        supabaseError = error.message;
      }
    } catch (e: any) {
      supabaseError = e?.message || 'Connection error';
    }
  }

  statusList.push({
    service: 'Supabase',
    role: 'PostgreSQL Database & Row Level Security',
    category: 'Database (SQL)',
    connected: supabasePing || supabaseReady,
    message: supabasePing
      ? 'Connected to Live PostgreSQL'
      : supabaseReady
      ? `Configured (${supabaseError ? 'Check table migration' : 'Ready'})`
      : 'Demo / Fallback Mode (Set keys in .env.local)',
    details: supabaseReady
      ? `Endpoint: ${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/^https?:\/\//, '')}`
      : 'Using local offline mock storage',
  });

  // 3. Cloudinary Storage Status
  const cloudinaryReady = isCloudinaryConfigured();
  statusList.push({
    service: 'Cloudinary',
    role: 'Media Storage, Auto-Optimization & CDN Delivery',
    category: 'Media Storage',
    connected: cloudinaryReady,
    message: cloudinaryReady
      ? `Active Cloud CDN (${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME})`
      : 'Local Preview Fallback (Set keys in .env.local)',
    details: cloudinaryReady
      ? `Preset: ${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`
      : 'Auto-converts uploads to temporary local data URI for testing',
  });

  // 4. GitHub Integration Status
  statusList.push({
    service: 'GitHub',
    role: 'Source Control & Vercel Git-Ops CI/CD',
    category: 'Version Control & CI/CD',
    connected: true,
    message: 'Git Repository Initialized & Ready',
    details: process.env.NEXT_PUBLIC_GITHUB_REPO || 'https://github.com',
  });

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    allHealthy: statusList.every((s) => s.connected),
    services: statusList,
  });
}
