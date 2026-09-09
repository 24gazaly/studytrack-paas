'use client';

import React from 'react';
import { Compass, Sparkles, Plus, Github } from 'lucide-react';

interface NavbarProps {
  onOpenSubmit: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSubmit,
  selectedCategory,
  onSelectCategory,
}) => {
  const githubRepo = process.env.NEXT_PUBLIC_GITHUB_REPO || 'https://github.com/24gazaly/studytrack-paas';

  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(9, 10, 15, 0.85)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '76px',
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          <div
            onClick={() => onSelectCategory('All')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)',
            }}>
              <Sparkles size={18} color="#ffffff" />
            </div>
            <span style={{
              fontSize: '1.4rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#ffffff',
            }}>
              Inspira<span style={{ color: '#a855f7' }}>.</span>
            </span>
          </div>

          {/* Quick Nav Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button
              onClick={() => onSelectCategory('All')}
              style={{
                fontSize: '0.88rem',
                fontWeight: selectedCategory === 'All' ? 700 : 500,
                color: selectedCategory === 'All' ? '#ffffff' : 'var(--text-secondary)',
                transition: 'color 0.2s',
              }}
            >
              Explore
            </button>
            <button
              onClick={() => onSelectCategory('Architecture')}
              style={{
                fontSize: '0.88rem',
                fontWeight: selectedCategory === 'Architecture' ? 700 : 500,
                color: selectedCategory === 'Architecture' ? '#ffffff' : 'var(--text-secondary)',
                transition: 'color 0.2s',
              }}
            >
              Architecture
            </button>
            <button
              onClick={() => onSelectCategory('Photography')}
              style={{
                fontSize: '0.88rem',
                fontWeight: selectedCategory === 'Photography' ? 700 : 500,
                color: selectedCategory === 'Photography' ? '#ffffff' : 'var(--text-secondary)',
                transition: 'color 0.2s',
              }}
            >
              Photography
            </button>
          </nav>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <a
            href={githubRepo}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-icon"
            title="GitHub Repository"
            aria-label="GitHub Repository"
          >
            <Github size={18} />
          </a>

          <button
            onClick={onOpenSubmit}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <Plus size={18} />
            <span>Submit Work</span>
          </button>
        </div>
      </div>
    </header>
  );
};
