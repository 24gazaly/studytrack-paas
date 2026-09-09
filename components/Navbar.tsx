'use client';

import React from 'react';
import { Layers, Github, Plus, Server, Cloud, Database, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenNewTask: () => void;
  onOpenArchitecture: () => void;
  paasHealth: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNewTask,
  onOpenArchitecture,
  paasHealth,
}) => {
  const githubRepo = process.env.NEXT_PUBLIC_GITHUB_REPO || 'https://github.com';

  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(10, 13, 20, 0.85)',
      backdropFilter: 'blur(20px)',
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
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)',
          }}>
            <Layers size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                Study<span style={{ color: '#818cf8' }}>Track</span>
              </span>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#a5b4fc',
                padding: '0.15rem 0.5rem',
                borderRadius: '999px',
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}>
                PaaS Edition
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Vercel • Supabase • Cloudinary
            </p>
          </div>
        </div>

        {/* Right Action Items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* PaaS Stack Health Button */}
          <button
            onClick={onOpenArchitecture}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            title="Lihat Arsitektur & Status PaaS"
          >
            <span className={`dot ${paasHealth ? 'dot-green' : 'dot-amber'}`}></span>
            <span style={{ fontSize: '0.8rem' }}>PaaS Architecture</span>
          </button>

          {/* GitHub Repo Link */}
          <a
            href={githubRepo}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-icon"
            title="Buka GitHub Repository"
            aria-label="GitHub Repository"
          >
            <Github size={18} />
          </a>

          {/* Add New Task Button */}
          <button
            onClick={onOpenNewTask}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Plus size={18} />
            <span>Tugas Baru</span>
          </button>
        </div>
      </div>
    </header>
  );
};
