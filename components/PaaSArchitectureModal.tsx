'use client';

import React from 'react';
import { X, Server, Database, Cloud, GitBranch, ArrowRight, Code, ShieldCheck, Terminal } from 'lucide-react';

interface PaaSArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaaSArchitectureModal: React.FC<PaaSArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

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
        maxWidth: '840px',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: '#0d1322',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '1rem',
        }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
              Arsitektur Cloud PaaS: <span style={{ color: '#818cf8' }}>StudyTrack</span>
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Dokumentasi integrasi Platform as a Service untuk tugas kuliah & evaluasi sistem.
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-icon"
            style={{ borderRadius: '50%' }}
            aria-label="Tutup modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* PaaS Diagram Flow */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          marginBottom: '2rem',
        }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: '#cbd5e1' }}>
            Alur Data Multi-PaaS
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            alignItems: 'center',
          }}>
            {/* Box 1: Vercel */}
            <div style={{
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: '12px',
              padding: '1rem',
              textAlign: 'center',
            }}>
              <Server size={24} color="#818cf8" style={{ margin: '0 auto 0.5rem' }} />
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>1. Vercel (App PaaS)</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Next.js Frontend & Serverless Edge APIs
              </div>
            </div>

            {/* Box 2: Supabase */}
            <div style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '12px',
              padding: '1rem',
              textAlign: 'center',
            }}>
              <Database size={24} color="#34d399" style={{ margin: '0 auto 0.5rem' }} />
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>2. Supabase (DB PaaS)</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Managed PostgreSQL & Realtime SQL
              </div>
            </div>

            {/* Box 3: Cloudinary */}
            <div style={{
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              borderRadius: '12px',
              padding: '1rem',
              textAlign: 'center',
            }}>
              <Cloud size={24} color="#38bdf8" style={{ margin: '0 auto 0.5rem' }} />
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>3. Cloudinary (Storage)</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Object CDN Storage & Image Transformation
              </div>
            </div>
          </div>
        </div>

        {/* Step-by-step Setup Guide */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Step 1: Supabase */}
          <div style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '1.25rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{
                background: '#10b981',
                color: '#000',
                fontWeight: 800,
                fontSize: '0.75rem',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>A</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Setup Database Supabase</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Buka dashboard Supabase, buat project baru, lalu buka <strong>SQL Editor</strong> dan jalankan isi file <code style={{ color: '#a5b4fc' }}>supabase_schema.sql</code> yang sudah disediakan di folder proyek.
            </p>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.75rem',
              background: '#090d16',
              padding: '0.65rem 1rem',
              borderRadius: '8px',
              color: '#94a3b8',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}>
              NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co<br />
              NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
            </div>
          </div>

          {/* Step 2: Cloudinary */}
          <div style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '1.25rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{
                background: '#06b6d4',
                color: '#000',
                fontWeight: 800,
                fontSize: '0.75rem',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>B</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Setup Storage Cloudinary</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Buka console Cloudinary, masuk ke <strong>Settings &gt; Upload &gt; Upload presets</strong>, buat preset baru dengan mode <strong>Unsigned</strong> (misal: <code style={{ color: '#38bdf8' }}>studytrack_preset</code>).
            </p>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.75rem',
              background: '#090d16',
              padding: '0.65rem 1rem',
              borderRadius: '8px',
              color: '#94a3b8',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}>
              NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=nama_cloud_anda<br />
              NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=studytrack_preset
            </div>
          </div>

          {/* Step 3: Deploy to Vercel via GitHub */}
          <div style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '1.25rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{
                background: '#8b5cf6',
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.75rem',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>C</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Deploy ke Vercel via GitHub (Git-Ops)</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Push kode ke GitHub, lalu buka dashboard Vercel &gt; <strong>Add New Project</strong> &gt; Import repo GitHub Anda. Tambahkan Environment Variables di atas ke Vercel dashboard. Vercel akan otomatis melakukan build &amp; deploy live dalam 1 menit!
            </p>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.75rem',
              background: '#090d16',
              padding: '0.65rem 1rem',
              borderRadius: '8px',
              color: '#34d399',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}>
              git remote add origin https://github.com/USERNAME/studytrack-paas.git<br />
              git push -u origin main
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '2rem', textAlign: 'right' }}>
          <button onClick={onClose} className="btn btn-primary">
            Tutup &amp; Mulai Menggunakan
          </button>
        </div>
      </div>
    </div>
  );
};
