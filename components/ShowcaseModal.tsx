'use client';

import React, { useState, useRef } from 'react';
import { X, Upload, CheckCircle, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import { Showcase } from '@/lib/types';
import { uploadToCloudinary } from '@/lib/cloudinary';

interface ShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (showcase: Omit<Showcase, 'id' | 'likes' | 'created_at'>) => Promise<void>;
}

export const ShowcaseModal: React.FC<ShowcaseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Architecture');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');

  // Image Upload state
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const result = await uploadToCloudinary(file);
      setImageUrl(result.url);
    } catch (err: any) {
      setUploadError(err?.message || 'Failed to upload artwork. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        category,
        author: author.trim() || 'Anonymous Creator',
        author_avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 50)}?w=100&auto=format&fit=crop&q=80`,
        description: description.trim() || undefined,
        image_url: imageUrl,
      });

      // Reset
      setTitle('');
      setCategory('Architecture');
      setAuthor('');
      setDescription('');
      setImageUrl(null);
      onClose();
    } catch (err: any) {
      alert('Error saving showcase: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1.5rem',
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '580px',
        background: '#0d1017',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: 'var(--radius-lg)',
        padding: '2.25rem',
        boxShadow: 'var(--shadow-card)',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.75rem',
        }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Submit Your Work</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Publish your creative artifact to the Inspira index.
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-icon"
            style={{ borderRadius: '50%' }}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Image Upload Area */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Artwork / Project Image *
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
              id="artwork-file-input"
            />

            {!imageUrl && !isUploading && (
              <label
                htmlFor="artwork-file-input"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2.5rem 1.5rem',
                  border: '2px dashed rgba(255, 255, 255, 0.15)',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'center',
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(99, 102, 241, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.85rem',
                }}>
                  <Upload size={22} color="#a5b4fc" />
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff' }}>
                  Click to upload high-res image
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Supports PNG, JPG, WebP up to 10MB
                </span>
              </label>
            )}

            {isUploading && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                padding: '2.5rem 1.5rem',
                background: 'rgba(99, 102, 241, 0.05)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                color: '#a5b4fc',
                fontSize: '0.88rem',
              }}>
                <Loader2 size={20} className="animate-spin" />
                <span>Optimizing and uploading artwork...</span>
              </div>
            )}

            {uploadError && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#f43f5e',
                fontSize: '0.75rem',
                marginTop: '0.5rem',
              }}>
                <AlertCircle size={14} />
                <span>{uploadError}</span>
              </div>
            )}

            {imageUrl && (
              <div style={{
                position: 'relative',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                aspectRatio: '16 / 9',
                border: '1px solid var(--border-subtle)',
              }}>
                <img
                  src={imageUrl}
                  alt="Upload preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={() => setImageUrl(null)}
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    background: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(8px)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  Change Image
                </button>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Project Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Zenith Kinetic Sculpture"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '0.85rem 1.15rem',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.9rem',
                color: '#ffffff',
              }}
            />
          </div>

          {/* Category & Creator Name */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.85rem 1.15rem',
                  background: '#151926',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem',
                  color: '#ffffff',
                }}
              >
                <option value="Architecture">Architecture</option>
                <option value="Photography">Photography</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="3D Art">3D Art</option>
                <option value="Branding">Branding</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Creator / Studio Name
              </label>
              <input
                type="text"
                placeholder="e.g. Studio Mono"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.85rem 1.15rem',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem',
                  color: '#ffffff',
                }}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Concept &amp; Description
            </label>
            <textarea
              rows={3}
              placeholder="Tell the story, materials used, design philosophy..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '0.85rem 1.15rem',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.9rem',
                color: '#ffffff',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.85rem',
            marginTop: '0.5rem',
          }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || isUploading || !imageUrl}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <span>Publish Artwork</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
