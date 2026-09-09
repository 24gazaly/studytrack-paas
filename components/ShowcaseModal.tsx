'use client';

import React, { useState, useRef } from 'react';
import { X, Upload, AlertCircle, Loader2, Link as LinkIcon, Sparkles } from 'lucide-react';
import { Showcase } from '@/lib/types';
import { uploadToCloudinary } from '@/lib/cloudinary';

interface ShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (showcase: Omit<Showcase, 'id' | 'likes' | 'created_at'>) => Promise<void>;
}

const SAMPLE_PRESETS = [
  {
    label: 'Modern Villa',
    category: 'Architecture',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
  },
  {
    label: 'Tokyo Neon',
    category: 'Photography',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
  },
  {
    label: 'Mobile UI Kit',
    category: 'UI/UX Design',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
  },
  {
    label: '3D Crystal',
    category: '3D Art',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  },
];

export const ShowcaseModal: React.FC<ShowcaseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Architecture');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');

  // Image state
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setFormError(null);
    setUploadNotice(null);

    try {
      // Try Cloudinary CDN upload first
      const result = await uploadToCloudinary(file);
      setImageUrl(result.url);
    } catch (err: any) {
      console.warn('Cloudinary upload fallback to data URL:', err);
      // Fallback: convert file to persistent Base64 Data URL so it always persists
      const reader = new FileReader();
      reader.onload = () => {
        const base64Url = reader.result as string;
        setImageUrl(base64Url);
        setUploadNotice('Gambar disimpan via data URL lokal (Cloud CDN offline).');
      };
      reader.onerror = () => {
        setFormError('Gagal membaca file gambar.');
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const applyUrl = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) {
      setFormError('Masukkan URL gambar yang valid.');
      return false;
    }
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:')) {
      setFormError('URL gambar harus dimulai dengan http:// atau https://');
      return false;
    }
    setFormError(null);
    setImageUrl(trimmed);
    return true;
  };

  const handlePresetSelect = (preset: typeof SAMPLE_PRESETS[0]) => {
    setImageUrl(preset.url);
    setUrlInput(preset.url);
    if (!category || category === 'Architecture') {
      setCategory(preset.category);
    }
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // If image URL is not set yet but user typed/pasted a URL, auto-resolve it
    let activeImage = imageUrl;
    if (!activeImage && urlInput.trim()) {
      const valid = applyUrl(urlInput);
      if (valid) {
        activeImage = urlInput.trim();
      } else {
        return;
      }
    }

    if (!title.trim()) {
      setFormError('Judul proyek wajib diisi.');
      return;
    }

    if (!activeImage) {
      setFormError('Silakan unggah foto, tempel URL gambar, atau pilih salah satu contoh gambar di bawah.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        category,
        author: author.trim() || 'Guest Creator',
        author_avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(author.trim() || 'Guest')}&background=2563eb&color=fff&size=100`,
        description: description.trim() || undefined,
        image_url: activeImage,
      });

      // Reset form on success
      setTitle('');
      setCategory('Architecture');
      setAuthor('');
      setDescription('');
      setImageUrl(null);
      setUrlInput('');
      setFormError(null);
      setUploadNotice(null);
      onClose();
    } catch (err: any) {
      setFormError('Gagal menyimpan karya: ' + (err?.message || 'Terjadi kesalahan sistem.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.88rem',
    color: '#ffffff',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.85)',
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
              Add a new creative project to the gallery.
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

        {/* Global Error Notice */}
        {formError && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-sm)',
            color: '#fca5a5',
            fontSize: '0.82rem',
            marginBottom: '1.25rem',
          }}>
            <AlertCircle size={16} color="#ef4444" style={{ flexShrink: 0 }} />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>

          {/* Image Section */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Project Image *
            </label>

            {/* Toggle: Upload vs URL */}
            {!imageUrl && (
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '0.75rem',
              }}>
                <button
                  type="button"
                  onClick={() => { setImageInputMode('upload'); setFormError(null); }}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${imageInputMode === 'upload' ? 'rgba(37, 99, 235, 0.6)' : 'var(--border-subtle)'}`,
                    background: imageInputMode === 'upload' ? 'rgba(37, 99, 235, 0.12)' : 'rgba(255,255,255,0.03)',
                    color: imageInputMode === 'upload' ? '#60a5fa' : 'var(--text-secondary)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    transition: 'all 0.2s',
                  }}
                >
                  <Upload size={13} /> Upload File
                </button>
                <button
                  type="button"
                  onClick={() => { setImageInputMode('url'); setFormError(null); }}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${imageInputMode === 'url' ? 'rgba(37, 99, 235, 0.6)' : 'var(--border-subtle)'}`,
                    background: imageInputMode === 'url' ? 'rgba(37, 99, 235, 0.12)' : 'rgba(255,255,255,0.03)',
                    color: imageInputMode === 'url' ? '#60a5fa' : 'var(--text-secondary)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    transition: 'all 0.2s',
                  }}
                >
                  <LinkIcon size={13} /> Paste URL
                </button>
              </div>
            )}

            {/* Upload Mode */}
            {imageInputMode === 'upload' && !imageUrl && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="artwork-file-input"
                />
                {!isUploading ? (
                  <label
                    htmlFor="artwork-file-input"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '2rem 1.5rem',
                      border: '2px dashed var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255, 255, 255, 0.02)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <div style={{
                      width: '44px', height: '44px',
                      borderRadius: '8px',
                      background: 'rgba(37, 99, 235, 0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '0.75rem',
                    }}>
                      <Upload size={20} color="#60a5fa" />
                    </div>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>
                      Click to select image
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      PNG, JPG, WebP · or use "Paste URL" above
                    </span>
                  </label>
                ) : (
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '0.65rem',
                    padding: '2.25rem 1.5rem',
                    background: 'rgba(37, 99, 235, 0.08)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(37, 99, 235, 0.25)',
                    color: '#93c5fd', fontSize: '0.85rem',
                  }}>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Uploading image...</span>
                  </div>
                )}
              </>
            )}

            {/* URL Mode */}
            {imageInputMode === 'url' && !imageUrl && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={urlInput}
                    onChange={(e) => {
                      setUrlInput(e.target.value);
                      setFormError(null);
                    }}
                    onBlur={() => {
                      if (urlInput.trim().startsWith('http://') || urlInput.trim().startsWith('https://')) {
                        applyUrl(urlInput);
                      }
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), applyUrl(urlInput))}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => applyUrl(urlInput)}
                    style={{
                      padding: '0.75rem 1rem',
                      background: 'var(--accent-primary)',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      color: '#fff',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Preview
                  </button>
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Tip: Copy any image URL from Unsplash, Pinterest, etc.
                </p>
              </div>
            )}

            {/* Quick Sample Presets (for fast 1-click testing) */}
            {!imageUrl && (
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <Sparkles size={12} color="#60a5fa" />
                  <span>Or pick a sample image:</span>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {SAMPLE_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handlePresetSelect(preset)}
                      style={{
                        padding: '0.35rem 0.65rem',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-secondary)',
                        fontSize: '0.74rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.5)';
                        e.currentTarget.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-subtle)';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Notice */}
            {uploadNotice && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                color: '#93c5fd', fontSize: '0.75rem', marginTop: '0.5rem',
              }}>
                <span>✓ {uploadNotice}</span>
              </div>
            )}

            {/* Preview Box */}
            {imageUrl && (
              <div style={{
                position: 'relative',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                aspectRatio: '16 / 9',
                border: '1px solid var(--border-subtle)',
                marginTop: '0.5rem',
              }}>
                <img
                  src={imageUrl}
                  alt="Upload preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={() => {
                    setFormError('Gambar dari URL ini tidak dapat dimuat. Coba URL lain.');
                    setImageUrl(null);
                  }}
                />
                <button
                  type="button"
                  onClick={() => { setImageUrl(null); setUrlInput(''); setFormError(null); }}
                  style={{
                    position: 'absolute', top: '0.65rem', right: '0.65rem',
                    background: 'rgba(0, 0, 0, 0.75)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '0.3rem 0.7rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Change Image
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
              onChange={(e) => {
                setTitle(e.target.value);
                setFormError(null);
              }}
              style={inputStyle}
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
                  ...inputStyle,
                  background: '#1e293b',
                }}
              >
                <option value="Architecture">Architecture</option>
                <option value="Photography">Photography</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="3D Art">3D Art</option>
                <option value="Branding">Branding</option>
                <option value="Illustration">Illustration</option>
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
                style={inputStyle}
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
                ...inputStyle,
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
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Publishing...</span>
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
