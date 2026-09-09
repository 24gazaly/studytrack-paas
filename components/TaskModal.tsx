'use client';

import React, { useState, useRef } from 'react';
import { X, UploadCloud, CheckCircle, AlertCircle, Loader2, FileText, Image as ImageIcon } from 'lucide-react';
import { Task, TaskPriority } from '@/lib/types';
import { uploadToCloudinary, isCloudinaryConfigured } from '@/lib/cloudinary';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'created_at'>) => Promise<void>;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
}) => {
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsUploading(true);
    setUploadError(null);

    try {
      const result = await uploadToCloudinary(file);
      setAttachmentUrl(result.url);
      setAttachmentName(result.originalFilename);
    } catch (err: any) {
      setUploadError(err?.message || 'Gagal mengunggah berkas ke Cloudinary.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAttachment = () => {
    setSelectedFile(null);
    setAttachmentUrl(null);
    setAttachmentName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !course.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddTask({
        title: title.trim(),
        course: course.trim(),
        description: description.trim() || undefined,
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
        priority,
        status: 'todo',
        attachment_url: attachmentUrl,
        attachment_name: attachmentName,
      });

      // Reset form
      setTitle('');
      setCourse('');
      setDescription('');
      setDeadline('');
      setPriority('medium');
      handleRemoveAttachment();
      onClose();
    } catch (err: any) {
      alert('Error saat menyimpan tugas: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
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
        background: '#0d1322',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        boxShadow: 'var(--shadow-lg)',
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
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Tambah Tugas Kuliah</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Data disimpan ke Supabase PostgreSQL & berkas ke Cloudinary.
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-icon"
            style={{ borderRadius: '50%' }}
            aria-label="Tutup modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* Judul Tugas */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Judul Tugas / Proyek *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Desain Arsitektur PaaS Multi-Cloud"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.88rem',
              }}
            />
          </div>

          {/* Mata Kuliah & Prioritas */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Mata Kuliah *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Komputasi Awan"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.88rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Tingkat Prioritas
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: '#151c2e',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.88rem',
                }}
              >
                <option value="low">Rendah (Low)</option>
                <option value="medium">Sedang (Medium)</option>
                <option value="high">Tinggi (High)</option>
                <option value="urgent">Mendesak (Urgent)</option>
              </select>
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Tenggat Waktu (Deadline)
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.88rem',
                colorScheme: 'dark',
              }}
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Catatan / Deskripsi Tugas
            </label>
            <textarea
              rows={3}
              placeholder="Catatan detail instruksi dosen, link referensi materi, dsb."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.88rem',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Cloudinary Storage Upload Section */}
          <div style={{
            background: 'rgba(6, 182, 212, 0.04)',
            border: '1px dashed rgba(6, 182, 212, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UploadCloud size={18} color="#38bdf8" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                  Lampiran Berkas (Cloudinary Storage PaaS)
                </span>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#38bdf8' }}>
                {isCloudinaryConfigured() ? 'Live CDN' : 'Local Preview'}
              </span>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Upload foto materi papan tulis, screenshot diagram arsitektur, atau bukti pengerjaan tugas.
            </p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,.pdf,.doc,.docx"
              style={{ display: 'none' }}
              id="cloudinary-file-input"
            />

            {!attachmentUrl && !isUploading && (
              <label
                htmlFor="cloudinary-file-input"
                className="btn btn-outline"
                style={{
                  width: '100%',
                  cursor: 'pointer',
                  borderStyle: 'dashed',
                  padding: '0.85rem',
                }}
              >
                <UploadCloud size={18} />
                <span>Pilih Berkas untuk Diupload</span>
              </label>
            )}

            {isUploading && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.85rem',
                fontSize: '0.85rem',
                color: '#38bdf8',
              }}>
                <Loader2 size={18} className="animate-pulse" />
                <span>Mengunggah berkas ke Cloudinary CDN...</span>
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

            {attachmentUrl && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                  <CheckCircle size={16} color="#34d399" />
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    color: '#6ee7b7',
                  }}>
                    {attachmentName || 'Berkas Terupload'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveAttachment}
                  style={{
                    color: '#f43f5e',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '0.2rem 0.5rem',
                  }}
                >
                  Hapus
                </button>
              </div>
            )}
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
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-pulse" />
                  <span>Menyimpan ke Supabase...</span>
                </>
              ) : (
                <span>Simpan Tugas</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
