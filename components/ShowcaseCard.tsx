'use client';

import React, { useState } from 'react';
import { Heart, ExternalLink, User } from 'lucide-react';
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
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}
    >
      <div className="card-image-wrapper">
        <img
          src={showcase.image_url}
          alt={showcase.title}
          loading="lazy"
        />

        {/* Floating Dark Gradient Overlay */}
        <div className="card-overlay">
          {/* Top Row: Category & Like Button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              background: 'rgba(0, 0, 0, 0.55)',
              backdropFilter: 'blur(8px)',
              padding: '0.25rem 0.65rem',
              borderRadius: '999px',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.15)',
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
                background: hasLiked ? '#f43f5e' : 'rgba(0, 0, 0, 0.55)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                padding: '0.3rem 0.65rem',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 600,
                transition: 'all 0.2s ease',
              }}
            >
              <Heart
                size={14}
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
              marginBottom: '0.4rem',
              lineHeight: 1.3,
            }}>
              {showcase.title}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {showcase.author_avatar ? (
                <img
                  src={showcase.author_avatar}
                  alt={showcase.author}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  }}
                />
              ) : (
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <User size={12} color="#ffffff" />
                </div>
              )}
              <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.8)', fontWeight: 500 }}>
                {showcase.author}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visible Details under the card on mobile / clean list */}
      <div style={{
        padding: '0.85rem 0.2rem 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ minWidth: 0, flex: 1, paddingRight: '0.5rem' }}>
          <h4 style={{
            fontSize: '0.92rem',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: '#f8fafc',
          }}>
            {showcase.title}
          </h4>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            by {showcase.author}
          </span>
        </div>

        <span style={{
          fontSize: '0.75rem',
          color: '#cbd5e1',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
        }}>
          <Heart size={13} color="#f43f5e" fill="#f43f5e" />
          <span>{showcase.likes}</span>
        </span>
      </div>
    </div>
  );
};
