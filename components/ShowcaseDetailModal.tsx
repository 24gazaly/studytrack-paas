'use client';

import React, { useState } from 'react';
import { X, Heart, ExternalLink, Download, User, Share2, Check } from 'lucide-react';
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
      background: 'rgba(0, 0, 0, 0.88)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 110,
      padding: '1.5rem',
    }}>
      <div className="glass-panel animate-fade-in" style={{
        maxWidth: '980px',
        width: '100%',
        maxHeight: '92vh',
        background: '#0d1017',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {showcase.author_avatar ? (
              <img
                src={showcase.author_avatar}
                alt={showcase.author}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              />
            ) : (
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <User size={20} color="#ffffff" />
              </div>
            )}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                {showcase.title}
              </h3>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Published by {showcase.author}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              onClick={handleLike}
              className="btn btn-secondary btn-sm"
              style={{
                background: hasLiked ? '#f43f5e' : 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                border: 'none',
              }}
            >
              <Heart size={15} fill={hasLiked ? '#ffffff' : 'transparent'} />
              <span>{showcase.likes} Likes</span>
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
              style={{ borderRadius: '50%' }}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* High-Res Image Display */}
        <div style={{
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          background: '#07080c',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
          maxHeight: '60vh',
        }}>
          <img
            src={showcase.image_url}
            alt={showcase.title}
            style={{
              maxWidth: '100%',
              maxHeight: '60vh',
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
          gap: '1.5rem',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1.25rem',
        }}>
          <div style={{ flex: '1 1 500px' }}>
            <span style={{
              display: 'inline-block',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#c4b5fd',
              background: 'rgba(168, 85, 247, 0.15)',
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              marginBottom: '0.85rem',
            }}>
              {showcase.category}
            </span>

            {showcase.description ? (
              <p style={{
                fontSize: '0.95rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
              }}>
                {showcase.description}
              </p>
            ) : (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                No additional description provided by the creator.
              </p>
            )}
          </div>

          <div style={{
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            textAlign: 'right',
          }}>
            <div>Curated on Inspira</div>
            <div style={{ marginTop: '0.25rem' }}>
              {new Date(showcase.created_at || Date.now()).toLocaleDateString('en-US', {
                month: 'long',
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
