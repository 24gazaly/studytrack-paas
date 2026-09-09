'use client';

import React from 'react';
import { X, ExternalLink, Download } from 'lucide-react';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  imageName: string;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  imageName,
}) => {
  if (!isOpen || !imageUrl) return null;

  const isImage = imageUrl.startsWith('data:image') || /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(imageUrl) || imageUrl.includes('cloudinary');

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
        maxWidth: '860px',
        width: '100%',
        maxHeight: '90vh',
        background: '#0d1322',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.75rem',
        }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{imageName}</h3>
            <span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>
              Cloudinary Media CDN Storage
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <span>Buka Asli</span>
              <ExternalLink size={14} />
            </a>
            <button
              onClick={onClose}
              className="btn btn-secondary btn-icon"
              style={{ borderRadius: '50%' }}
              aria-label="Tutup preview"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Preview */}
        <div style={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.4)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
        }}>
          {isImage ? (
            <img
              src={imageUrl}
              alt={imageName}
              style={{
                maxWidth: '100%',
                maxHeight: '65vh',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
              }}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Berkas ini berupa dokumen. Klik tombol di bawah untuk membukanya.
              </p>
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Buka / Unduh Dokumen
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
