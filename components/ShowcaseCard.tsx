'use client';

import React, { useState } from 'react';
import { Heart, User } from 'lucide-react';
import { Showcase } from '@/lib/types';

interface ShowcaseCardProps {
  showcase: Showcase;
  onLike: (id: string) => void;
  onClick: (showcase: Showcase) => void;
}

export const ShowcaseCard: React.FC<ShowcaseCardProps> = ({
  showcase,
  onLike,
  onClick,
}) => {
  const [hasLiked, setHasLiked] = useState(false);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasLiked) {
      setHasLiked(true);
      onLike(showcase.id);
    }
  };

  return (
    <div
      className="card-container"
      onClick={() => onClick(showcase)}
      style={{
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      <div className="card-image-wrapper">
        <img
          src={showcase.image_url}
          alt={showcase.title}
          loading="lazy"
        />

        {/* Dark Gradient Overlay */}
        <div className="card-overlay">
          {/* Top Row: Category & Like Button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              background: 'rgba(11, 15, 25, 0.85)',
              padding: '0.25rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              color: '#93c5fd',
              border: '1px solid rgba(37, 99, 235, 0.3)',
            }}>
              {showcase.category}
            </span>

            <button
              type="button"
              onClick={handleLikeClick}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: hasLiked ? '#ef4444' : 'rgba(11, 15, 25, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                padding: '0.28rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                fontWeight: 600,
                transition: 'all 0.15s ease',
              }}
            >
              <Heart
                size={13}
                fill={hasLiked ? '#ffffff' : 'transparent'}
                color="#ffffff"
              />
              <span>{showcase.likes}</span>
            </button>
          </div>

          {/* Bottom Row: Title & Author */}
          <div>
            <h3 style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '0.35rem',
              lineHeight: 1.3,
            }}>
              {showcase.title}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              {showcase.author_avatar ? (
                <img
                  src={showcase.author_avatar}
                  alt={showcase.author}
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  }}
                />
              ) : (
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <User size={11} color="#94a3b8" />
                </div>
              )}
              <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 500 }}>
                {showcase.author}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div style={{
        padding: '0.85rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-card)',
      }}>
        <div style={{ minWidth: 0, flex: 1, paddingRight: '0.5rem' }}>
          <h4 style={{
            fontSize: '0.9rem',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: '#f8fafc',
          }}>
            {showcase.title}
          </h4>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {showcase.author}
          </span>
        </div>

        <span style={{
          fontSize: '0.75rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
        }}>
          <Heart size={13} color={hasLiked ? '#ef4444' : '#64748b'} fill={hasLiked ? '#ef4444' : 'transparent'} />
          <span>{showcase.likes}</span>
        </span>
      </div>
    </div>
  );
};
