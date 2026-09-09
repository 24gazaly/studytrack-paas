'use client';

import React from 'react';
import { Search, Sparkles } from 'lucide-react';
import { Category } from '@/lib/types';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

const CATEGORIES: Category[] = [
  'All',
  'Architecture',
  'Photography',
  'UI/UX Design',
  '3D Art',
  'Branding',
];

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section style={{
      textAlign: 'center',
      padding: '4rem 0 3rem',
      position: 'relative',
    }}>
      {/* Small Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        padding: '0.35rem 0.95rem',
        borderRadius: 'var(--radius-full)',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid var(--border-subtle)',
        fontSize: '0.78rem',
        fontWeight: 600,
        color: '#c4b5fd',
        marginBottom: '1.5rem',
      }}>
        <Sparkles size={14} color="#a855f7" />
        <span>Curated Global Creative Index</span>
      </div>

      {/* Main Title */}
      <h1 style={{
        fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
        fontWeight: 800,
        lineHeight: 1.15,
        marginBottom: '1.25rem',
        maxWidth: '820px',
        margin: '0 auto 1.25rem',
      }}>
        Discover &amp; Share <span style={{
          background: 'var(--accent-gradient)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>Inspiring Work</span>
      </h1>

      {/* Subtitle */}
      <p style={{
        fontSize: '1.05rem',
        color: 'var(--text-secondary)',
        maxWidth: '600px',
        margin: '0 auto 2.5rem',
        lineHeight: 1.6,
      }}>
        Explore groundbreaking architecture, evocative photography, 3D explorations, and contemporary design artifacts.
      </p>

      {/* Search Input */}
      <div style={{
        maxWidth: '540px',
        margin: '0 auto 2.5rem',
        position: 'relative',
      }}>
        <Search
          size={18}
          color="#94a3b8"
          style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          type="text"
          placeholder="Search projects, creators, aesthetics..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            padding: '0.95rem 1.25rem 0.95rem 3.1rem',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.92rem',
            color: '#ffffff',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
            outline: 'none',
          }}
        />
      </div>

      {/* Category Filter Pills */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.65rem',
        flexWrap: 'wrap',
      }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>
    </section>
  );
};
