'use client';

import React from 'react';
import { Search, Compass } from 'lucide-react';
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
  'Illustration',
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
      padding: '3.75rem 0 2.5rem',
      position: 'relative',
    }}>
      {/* Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        padding: '0.35rem 0.95rem',
        borderRadius: 'var(--radius-full)',
        background: 'rgba(37, 99, 235, 0.1)',
        border: '1px solid rgba(37, 99, 235, 0.25)',
        fontSize: '0.78rem',
        fontWeight: 600,
        color: '#93c5fd',
        marginBottom: '1.25rem',
      }}>
        <Compass size={14} color="#60a5fa" />
        <span>Curated Visual Directory</span>
      </div>

      {/* Main Title - Classic Simple Blue */}
      <h1 style={{
        fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
        fontWeight: 800,
        lineHeight: 1.15,
        marginBottom: '1rem',
        maxWidth: '820px',
        margin: '0 auto 1rem',
        color: '#f8fafc',
      }}>
        Discover &amp; Share <span style={{ color: 'var(--accent-light)' }}>Creative Work</span>
      </h1>

      {/* Subtitle */}
      <p style={{
        fontSize: '1rem',
        color: 'var(--text-secondary)',
        maxWidth: '580px',
        margin: '0 auto 2.25rem',
        lineHeight: 1.6,
      }}>
        A minimalist showcase for contemporary architecture, fine photography, UI/UX systems, and visual artistry.
      </p>

      {/* Search Input */}
      <div style={{
        maxWidth: '520px',
        margin: '0 auto 2.25rem',
        position: 'relative',
      }}>
        <Search
          size={18}
          color="#64748b"
          style={{ position: 'absolute', left: '1.15rem', top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          type="text"
          placeholder="Search projects, creators, topics..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            padding: '0.85rem 1.25rem 0.85rem 2.9rem',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.9rem',
            color: '#ffffff',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)',
            outline: 'none',
          }}
        />
      </div>

      {/* Category Pills */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.55rem',
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
