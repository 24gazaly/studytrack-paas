'use client';

import React from 'react';
import { Compass, Plus, Github } from 'lucide-react';

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
      background: 'rgba(11, 15, 25, 0.92)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px',
      }}>
        {/* Brand Logo - Classic Blue */}
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
              borderRadius: '8px',
              background: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(37, 99, 235, 0.35)',
            }}>
              <Compass size={20} color="#ffffff" />
            </div>
            <span style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#ffffff',
            }}>
              Inspira<span style={{ color: 'var(--accent-light)' }}>.</span>
            </span>
          </div>

          {/* Nav Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <button
              onClick={() => onSelectCategory('All')}
              style={{
                fontSize: '0.88rem',
                fontWeight: selectedCategory === 'All' ? 700 : 500,
                color: selectedCategory === 'All' ? '#ffffff' : 'var(--text-secondary)',
                transition: 'color 0.15s',
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
                transition: 'color 0.15s',
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
                transition: 'color 0.15s',
              }}
            >
              Photography
            </button>
          </nav>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
