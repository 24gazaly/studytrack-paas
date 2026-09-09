'use client';

import React, { useState, useRef } from 'react';
import { X, Upload, AlertCircle, Loader2 } from 'lucide-react';
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
      setUploadError(err?.message || 'Failed to upload artwork.');
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
        author: author.trim() || 'Guest Creator',
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
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1.5rem',
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '560px',
        background: '#0f172a',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '2rem',
        boxShadow: 'var(--shadow-card)',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
        }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Submit Your Work</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Add a new creative project to the directory.
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* Image Upload Area */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.45rem' }}>
              Project Image *
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
                  padding: '2.25rem 1.5rem',
                  border: '2px dashed var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'center',
                }}
              >
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '8px',
                  background: 'rgba(37, 99, 235, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.75rem',
                }}>
                  <Upload size={20} color="#60a5fa" />
                </div>
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>
                  Click to select high-res image
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Supports PNG, JPG, WebP
                </span>
              </label>
            )}

            {isUploading && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                padding: '2.25rem 1.5rem',
                background: 'rgba(37, 99, 235, 0.08)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(37, 99, 235, 0.25)',
                color: '#93c5fd',
                fontSize: '0.85rem',
              }}>
                <Loader2 size={18} className="animate-spin" />
                <span>Uploading image to media CDN...</span>
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
                borderRadius: 'var(--radius-sm)',
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
                    top: '0.65rem',
                    right: '0.65rem',
                    background: 'rgba(0, 0, 0, 0.75)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '0.3rem 0.7rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  Change
                </button>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Project Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Modern Coastal Residence"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.88rem',
                color: '#ffffff',
              }}
            />
          </div>

          {/* Category & Creator */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: '#1e293b',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.88rem',
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
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Creator / Studio
              </label>
              <input
                type="text"
                placeholder="e.g. Studio Minimal"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.88rem',
                  color: '#ffffff',
                }}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Brief details about the project..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.88rem',
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
            gap: '0.75rem',
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
                  <span>Saving...</span>
                </>
              ) : (
                <span>Publish Project</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
