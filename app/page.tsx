'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { ShowcaseCard } from '@/components/ShowcaseCard';
import { ShowcaseModal } from '@/components/ShowcaseModal';
import { ShowcaseDetailModal } from '@/components/ShowcaseDetailModal';
import { Showcase } from '@/lib/types';
import { initialShowcases } from '@/lib/mockData';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { Compass, Plus, RefreshCw } from 'lucide-react';

export default function Home() {
  const [showcases, setShowcases] = useState<Showcase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modals
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedShowcase, setSelectedShowcase] = useState<Showcase | null>(null);

  // 1. Fetch Showcases - Serverless API + Direct Supabase for guaranteed multi-device sync
  const fetchShowcases = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    else setIsRefreshing(true);

    let fetchedData: Showcase[] | null = null;

    // A. First try Serverless API endpoint
    try {
      const res = await fetch('/api/posts', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.posts && json.posts.length > 0) {
          fetchedData = json.posts;
        }
      }
    } catch (apiErr) {
      console.warn('API fetch failed, trying direct Supabase client:', apiErr);
    }

    // B. If API didn't return data, try direct Supabase client
    if (!fetchedData && isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          fetchedData = data as Showcase[];
        }
      } catch (sbErr) {
        console.warn('Direct Supabase fetch failed:', sbErr);
      }
    }

    if (fetchedData && fetchedData.length > 0) {
      setShowcases(fetchedData);
      if (typeof window !== 'undefined') {
        localStorage.setItem('inspira_showcases', JSON.stringify(fetchedData));
      }
    } else {
      // Fallback
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('inspira_showcases');
        if (saved) {
          try {
            setShowcases(JSON.parse(saved));
            setIsLoading(false);
            setIsRefreshing(false);
            return;
          } catch {}
        }
      }
      setShowcases(initialShowcases);
    }

    setIsLoading(false);
    setIsRefreshing(false);
  }, []);

  // Initial load
  useEffect(() => {
    fetchShowcases();

    // Auto-refresh when window gains focus (user switches back from phone/tablet)
    const handleFocus = () => fetchShowcases(true);
    window.addEventListener('focus', handleFocus);

    // Periodic background sync every 12 seconds for real-time multi-device collaboration
    const interval = setInterval(() => fetchShowcases(true), 12000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [fetchShowcases]);

  // 2. Add New Showcase (Syncs to Serverless API + Supabase DB)
  const handleAddShowcase = async (newShowcaseData: Omit<Showcase, 'id' | 'likes' | 'created_at'>) => {
    // Optimistic UI update
    const tempPost: Showcase = {
      ...newShowcaseData,
      id: 'temp_' + Date.now(),
      likes: 1,
      created_at: new Date().toISOString(),
    };
    setShowcases((prev) => [tempPost, ...prev]);

    try {
      // Send to serverless API
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newShowcaseData),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.post) {
          // Replace temp post with real database record
          setShowcases((prev) =>
            prev.map((p) => (p.id === tempPost.id ? json.post : p))
          );
          return;
        }
      }
    } catch (err) {
      console.warn('POST to /api/posts failed, trying direct Supabase:', err);
    }

    // Direct Supabase fallback
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('posts')
          .insert([{
            title: newShowcaseData.title,
            category: newShowcaseData.category,
            author: newShowcaseData.author,
            author_avatar: newShowcaseData.author_avatar,
            description: newShowcaseData.description,
            image_url: newShowcaseData.image_url,
            likes: 1,
          }])
          .select()
          .single();

        if (!error && data) {
          setShowcases((prev) =>
            prev.map((p) => (p.id === tempPost.id ? (data as Showcase) : p))
          );
        }
      } catch (err) {
        console.error('Direct Supabase insert failed:', err);
      }
    }
  };

  // 3. Like a Showcase
  const handleLike = async (id: string) => {
    const target = showcases.find((item) => item.id === id);
    const newLikes = (target?.likes || 0) + 1;

    // Optimistic update
    setShowcases((prev) =>
      prev.map((item) => (item.id === id ? { ...item, likes: newLikes } : item))
    );

    if (selectedShowcase && selectedShowcase.id === id) {
      setSelectedShowcase((prev) => prev ? { ...prev, likes: newLikes } : null);
    }

    // Send update to API
    try {
      fetch('/api/posts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, currentLikes: target?.likes || 0 }),
      }).catch(() => {});
    } catch {}
  };

  // Filtering Logic
  const filteredShowcases = showcases.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <Navbar
        onOpenSubmit={() => setIsSubmitModalOpen(true)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Main Content */}
      <main className="container" style={{ flex: 1, paddingBottom: '5rem' }}>
        {/* Hero Banner */}
        <Hero
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Sync Indicator / Refresh Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
        }}>
          <div>
            Showing <strong>{filteredShowcases.length}</strong> creations
          </div>
          <button
            onClick={() => fetchShowcases(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: 'var(--text-secondary)',
              fontSize: '0.78rem',
              cursor: 'pointer',
              padding: '0.2rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.04)',
            }}
            title="Refresh database sync"
          >
            <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
            <span>Sync</span>
          </button>
        </div>

        {/* Gallery Grid */}
        <section>
          {filteredShowcases.length === 0 && !isLoading ? (
            <div className="glass-panel" style={{
              textAlign: 'center',
              padding: '5rem 2rem',
              borderRadius: 'var(--radius-md)',
            }}>
              <Compass size={48} color="#64748b" style={{ margin: '0 auto 1.25rem' }} />
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                No creations found
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
                {searchQuery || selectedCategory !== 'All'
                  ? 'Try selecting another category or refining your search term.'
                  : 'Be the first creator to publish an inspiring piece to this gallery.'}
              </p>
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="btn btn-primary"
              >
                <Plus size={16} />
                <span>Submit First Work</span>
              </button>
            </div>
          ) : (
            <div className="gallery-grid">
              {filteredShowcases.map((showcase) => (
                <ShowcaseCard
                  key={showcase.id}
                  showcase={showcase}
                  onLike={handleLike}
                  onClick={(item) => setSelectedShowcase(item)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        background: '#070b14',
        padding: '2.5rem 0',
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Compass size={16} color="#ffffff" />
            </div>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
              Inspira<span style={{ color: 'var(--accent-light)' }}>.</span>
            </span>
            <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Curated Visual &amp; Design Showcase
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <a href="#" style={{ color: 'var(--text-secondary)' }}>Explore</a>
            <a href="#" style={{ color: 'var(--text-secondary)' }}>Privacy</a>
            <a href="#" style={{ color: 'var(--text-secondary)' }}>Terms</a>
            <a
              href="https://github.com/24gazaly/studytrack-paas"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent-light)', fontWeight: 600 }}
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ShowcaseModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmit={handleAddShowcase}
      />

      <ShowcaseDetailModal
        isOpen={Boolean(selectedShowcase)}
        onClose={() => setSelectedShowcase(null)}
        showcase={selectedShowcase}
        onLike={handleLike}
      />
    </div>
  );
}
