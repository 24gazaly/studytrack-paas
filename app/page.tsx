'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { ShowcaseCard } from '@/components/ShowcaseCard';
import { ShowcaseModal } from '@/components/ShowcaseModal';
import { ShowcaseDetailModal } from '@/components/ShowcaseDetailModal';
import { Showcase } from '@/lib/types';
import { initialShowcases } from '@/lib/mockData';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { Sparkles, Plus, Compass } from 'lucide-react';

export default function Home() {
  const [showcases, setShowcases] = useState<Showcase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modals
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedShowcase, setSelectedShowcase] = useState<Showcase | null>(null);

  // 1. Fetch Showcases from Supabase or Fallback
  const fetchShowcases = async () => {
    setIsLoading(true);

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          setShowcases(data as Showcase[]);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Supabase posts fetch failed, falling back to local:', err);
      }
    }

    // Local storage or initial mock showcases
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('inspira_showcases');
      if (saved) {
        try {
          setShowcases(JSON.parse(saved));
          setIsLoading(false);
          return;
        } catch {}
      }
    }

    setShowcases(initialShowcases);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchShowcases();
  }, []);

  // Save to localStorage when updated
  useEffect(() => {
    if (typeof window !== 'undefined' && showcases.length > 0) {
      localStorage.setItem('inspira_showcases', JSON.stringify(showcases));
    }
  }, [showcases]);

  // 2. Add New Showcase
  const handleAddShowcase = async (newShowcaseData: Omit<Showcase, 'id' | 'likes' | 'created_at'>) => {
    const newShowcase: Showcase = {
      ...newShowcaseData,
      id: 'post_' + Date.now(),
      likes: 1,
      created_at: new Date().toISOString(),
    };

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
          setShowcases((prev) => [data as Showcase, ...prev]);
          return;
        }
      } catch (err) {
        console.warn('Supabase insert failed, saving locally:', err);
      }
    }

    setShowcases((prev) => [newShowcase, ...prev]);
  };

  // 3. Like a Showcase
  const handleLike = async (id: string) => {
    setShowcases((prev) =>
      prev.map((item) => (item.id === id ? { ...item, likes: item.likes + 1 } : item))
    );

    if (selectedShowcase && selectedShowcase.id === id) {
      setSelectedShowcase((prev) => prev ? { ...prev, likes: prev.likes + 1 } : null);
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        const current = showcases.find((s) => s.id === id);
        if (current) {
          await supabase
            .from('posts')
            .update({ likes: current.likes + 1 })
            .eq('id', id);
        }
      } catch (err) {
        console.warn('Supabase like update failed:', err);
      }
    }
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

        {/* Gallery Grid */}
        <section style={{ marginTop: '1.5rem' }}>
          {filteredShowcases.length === 0 ? (
            <div className="glass-panel" style={{
              textAlign: 'center',
              padding: '5rem 2rem',
              borderRadius: 'var(--radius-lg)',
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

      {/* Elegant Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        background: '#07080c',
        padding: '3rem 0 2.5rem',
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
              borderRadius: '8px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Sparkles size={14} color="#ffffff" />
            </div>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
              Inspira<span style={{ color: '#a855f7' }}>.</span>
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
              style={{ color: '#a5b4fc', fontWeight: 600 }}
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
