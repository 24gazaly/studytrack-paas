'use client';

import React from 'react';
import { Server, Database, Cloud, GitBranch, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import { PaaSStatus } from '@/lib/types';

interface PaaSStatusBannerProps {
  statuses: PaaSStatus[];
  onOpenDetails: () => void;
}

export const PaaSStatusBanner: React.FC<PaaSStatusBannerProps> = ({
  statuses,
  onOpenDetails,
}) => {
  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
      }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Status Integrasi Platform as a Service (PaaS)
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Infrastruktur multi-cloud modern terintegrasi untuk frontend, serverless API, database SQL, dan media storage.
          </p>
        </div>
        <button
          onClick={onOpenDetails}
          className="btn btn-outline btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
        >
          <span>Panduan Setup Kredensial</span>
          <ExternalLink size={14} />
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem',
      }}>
        {/* 1. Vercel Card */}
        <div className="glass-panel" style={{ padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-subtle)',
              }}>
                <Server size={20} color="#ffffff" />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Vercel</h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>App & Serverless PaaS</span>
              </div>
            </div>
            <span className="badge badge-completed">
              <CheckCircle2 size={12} />
              <span>Active</span>
            </span>
          </div>
          <div style={{ marginTop: '0.85rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Next.js App Router dengan Vercel Serverless Functions di Edge Global Network.
          </div>
        </div>

        {/* 2. Supabase Card */}
        <div className="glass-panel" style={{ padding: '1.25rem', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(16, 185, 129, 0.25)',
              }}>
                <Database size={20} color="#34d399" />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Supabase</h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Database PaaS (PostgreSQL)</span>
              </div>
            </div>
            {statuses.find((s) => s.service === 'Supabase')?.connected ? (
              <span className="badge badge-completed">
                <CheckCircle2 size={12} />
                <span>Connected</span>
              </span>
            ) : (
              <span className="badge badge-high" title="Isi kredensial di .env.local untuk live DB">
                <AlertCircle size={12} />
                <span>Demo Mode</span>
              </span>
            )}
          </div>
          <div style={{ marginTop: '0.85rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Penyimpanan data relasional PostgreSQL dengan Row-Level Security (RLS).
          </div>
        </div>

        {/* 3. Cloudinary Card */}
        <div className="glass-panel" style={{ padding: '1.25rem', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(6, 182, 212, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(6, 182, 212, 0.25)',
              }}>
                <Cloud size={20} color="#38bdf8" />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Cloudinary</h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Storage PaaS & CDN</span>
              </div>
            </div>
            {statuses.find((s) => s.service === 'Cloudinary')?.connected ? (
              <span className="badge badge-completed">
                <CheckCircle2 size={12} />
                <span>Active CDN</span>
              </span>
            ) : (
              <span className="badge badge-high" title="Isi kredensial di .env.local untuk live Cloudinary">
                <AlertCircle size={12} />
                <span>Local Fallback</span>
              </span>
            )}
          </div>
          <div style={{ marginTop: '0.85rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Upload lampiran berkas & kompresi gambar otomatis via high-speed CDN.
          </div>
        </div>

        {/* 4. GitHub Card */}
        <div className="glass-panel" style={{ padding: '1.25rem', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(139, 92, 246, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(139, 92, 246, 0.25)',
              }}>
                <GitBranch size={20} color="#a78bfa" />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>GitHub</h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Git-Ops & CI/CD</span>
              </div>
            </div>
            <span className="badge badge-completed">
              <CheckCircle2 size={12} />
              <span>Ready</span>
            </span>
          </div>
          <div style={{ marginTop: '0.85rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Otomatisasi build dan deployment ke Vercel setiap perubahan kode di-push ke GitHub.
          </div>
        </div>
      </div>
    </section>
  );
};
