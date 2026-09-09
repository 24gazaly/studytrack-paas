'use client';

import React, { useState } from 'react';
import { X, Heart, ExternalLink, User, Share2, Check } from 'lucide-react';
import { Showcase } from '@/lib/types';

interface ShowcaseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  showcase: Showcase | null;
  onLike: (id: string) => void;
}

export const ShowcaseDetailModal: React.FC<ShowcaseDetailModalProps> = ({
  isOpen,
  onClose,
  showcase,
  onLike,
}) => {
  const [copied, setCopied] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  if (!isOpen || !showcase) return null;

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLike = () => {
    if (!hasLiked) {
      setHasLiked(true);
      onLike(showcase.id);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 110,
      padding: '1.5rem',
    }}>
      <div className="glass-panel animate-fade-in" style={{
        maxWidth: '960px',
        width: '100%',
        maxHeight: '92vh',
        background: '#0f172a',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {showcase.author_avatar ? (
              <img
                src={showcase.author_avatar}
                alt={showcase.author}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1px solid var(--border-subtle)',
                }}
              />
            ) : (
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <User size={18} color="#94a3b8" />
              </div>
            )}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                {showcase.title}
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                by {showcase.author}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={handleLike}
              className="btn btn-secondary btn-sm"
              style={{
                background: hasLiked ? '#ef4444' : 'rgba(255, 255, 255, 0.06)',
                color: '#ffffff',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <Heart size={14} fill={hasLiked ? '#ffffff' : 'transparent'} />
              <span>{showcase.likes}</span>
            </button>

            <button
              onClick={handleShare}
              className="btn btn-secondary btn-sm"
              title="Share link"
            >
              {copied ? <Check size={14} color="#10b981" /> : <Share2 size={14} />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>

            <a
              href={showcase.image_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              title="Open full resolution"
            >
              <ExternalLink size={14} />
              <span>Full Size</span>
            </a>

            <button
              onClick={onClose}
              className="btn btn-secondary btn-icon"
              style={{ borderRadius: '50%', width: '34px', height: '34px' }}
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* High-Res Image Display */}
        <div style={{
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
          background: '#070b14',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
          maxHeight: '62vh',
        }}>
          <img
            src={showcase.image_url}
            alt={showcase.title}
            style={{
              maxWidth: '100%',
              maxHeight: '62vh',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>

        {/* Details & Story */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1rem',
        }}>
          <div style={{ flex: '1 1 500px' }}>
            <span style={{
              display: 'inline-block',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#93c5fd',
              background: 'rgba(37, 99, 235, 0.12)',
              padding: '0.2rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(37, 99, 235, 0.25)',
              marginBottom: '0.65rem',
            }}>
              {showcase.category}
            </span>

            {showcase.description ? (
              <p style={{
                fontSize: '0.92rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
              }}>
                {showcase.description}
              </p>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                No description provided.
              </p>
            )}
          </div>

          <div style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            textAlign: 'right',
          }}>
            <div>Curated on Inspira</div>
            <div style={{ marginTop: '0.2rem' }}>
              {new Date(showcase.created_at || Date.now()).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
