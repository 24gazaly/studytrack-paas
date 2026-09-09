'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { PaaSStatusBanner } from '@/components/PaaSStatusBanner';
import { TaskCard } from '@/components/TaskCard';
import { TaskModal } from '@/components/TaskModal';
import { PaaSArchitectureModal } from '@/components/PaaSArchitectureModal';
import { ImagePreviewModal } from '@/components/ImagePreviewModal';
import { Task, TaskPriority, TaskStatus, PaaSStatus } from '@/lib/types';
import { initialMockTasks } from '@/lib/mockData';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FolderOpen,
  Plus,
  Server,
  Cloud,
  Database,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paasStatuses, setPaasStatuses] = useState<PaaSStatus[]>([]);
  const [isRefreshingPaaS, setIsRefreshingPaaS] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);

  // 1. Fetch PaaS Health Status
  const fetchPaaSStatus = async () => {
    setIsRefreshingPaaS(true);
    try {
      const res = await fetch('/api/paas-check');
      if (res.ok) {
        const data = await res.json();
        setPaasStatuses(data.services || []);
      }
    } catch (err) {
      console.error('Failed to fetch PaaS status', err);
    } finally {
      setIsRefreshingPaaS(false);
    }
  };

  // 2. Fetch Tasks from Supabase or Local Fallback
  const fetchTasks = async () => {
    setIsLoading(true);
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) {
          setTasks(data as Task[]);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Supabase fetch failed, loading local fallback:', err);
      }
    }

    // Local fallback from localStorage or mock data
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('studytrack_tasks');
      if (saved) {
        try {
          setTasks(JSON.parse(saved));
          setIsLoading(false);
          return;
        } catch {
          // fallback to initial
        }
      }
    }
    setTasks(initialMockTasks);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPaaSStatus();
    fetchTasks();
  }, []);

  // Save to localStorage whenever tasks change in demo/fallback mode
  useEffect(() => {
    if (!isSupabaseConfigured() && typeof window !== 'undefined' && tasks.length > 0) {
      localStorage.setItem('studytrack_tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  // 3. Handlers for CRUD operations
  const handleAddTask = async (newTaskData: Omit<Task, 'id' | 'created_at'>) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .insert([newTaskData])
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setTasks((prev) => [data as Task, ...prev]);
          return;
        }
      } catch (err) {
        console.warn('Supabase insert failed, saving locally:', err);
      }
    }

    // Local fallback
    const localNewTask: Task = {
      ...newTaskData,
      id: 'task_' + Date.now(),
      created_at: new Date().toISOString(),
    };
    setTasks((prev) => [localNewTask, ...prev]);
  };

  const handleUpdateStatus = async (id: string, newStatus: TaskStatus) => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status: newStatus } : task))
    );

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('tasks').update({ status: newStatus }).eq('id', id);
      } catch (err) {
        console.error('Failed to update status in Supabase:', err);
      }
    }
  };

  const handleDeleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('tasks').delete().eq('id', id);
      } catch (err) {
        console.error('Failed to delete in Supabase:', err);
      }
    }
  };

  // Filter and Search Logic
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Summary Metrics
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status !== 'completed').length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const attachmentCount = tasks.filter((t) => t.attachment_url).length;

  const isAllHealthy = paasStatuses.every((s) => s.connected);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar
        onOpenNewTask={() => setIsTaskModalOpen(true)}
        onOpenArchitecture={() => setIsArchitectureModalOpen(true)}
        paasHealth={isAllHealthy}
      />

      {/* Main Container */}
      <main className="container" style={{ flex: 1, padding: '2.5rem 1.5rem' }}>
        {/* PaaS Status & Multi-Cloud Banner */}
        <PaaSStatusBanner
          statuses={paasStatuses}
          onOpenDetails={() => setIsArchitectureModalOpen(true)}
        />

        {/* Metrics Overview Row */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2.5rem',
        }}>
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Tugas</span>
              <FolderOpen size={18} color="#818cf8" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.35rem' }}>
              {totalTasks}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Perlu Dikerjakan</span>
              <Clock size={18} color="#f59e0b" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.35rem', color: '#fcd34d' }}>
              {pendingTasks}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Selesai</span>
              <CheckCircle2 size={18} color="#10b981" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.35rem', color: '#6ee7b7' }}>
              {completedTasks}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Cloudinary Media</span>
              <Cloud size={18} color="#38bdf8" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.35rem', color: '#38bdf8' }}>
              {attachmentCount}
            </div>
          </div>
        </section>

        {/* Filter and Search Bar */}
        <section style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}>
          {/* Search Box */}
          <div style={{
            position: 'relative',
            flex: '1 1 300px',
            maxWidth: '450px',
          }}>
            <Search
              size={16}
              color="#94a3b8"
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Cari tugas, mata kuliah, atau topik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 1rem 0.65rem 2.5rem',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
              }}
            />
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '0.65rem 0.9rem',
                background: '#151c2e',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.82rem',
              }}
            >
              <option value="all">Semua Status</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              style={{
                padding: '0.65rem 0.9rem',
                background: '#151c2e',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.82rem',
              }}
            >
              <option value="all">Semua Prioritas</option>
              <option value="urgent">Mendesak (Urgent)</option>
              <option value="high">Tinggi (High)</option>
              <option value="medium">Sedang (Medium)</option>
              <option value="low">Rendah (Low)</option>
            </select>

            <button
              onClick={() => {
                fetchTasks();
                fetchPaaSStatus();
              }}
              className="btn btn-secondary btn-icon"
              title="Refresh Data & PaaS Status"
              disabled={isLoading || isRefreshingPaaS}
            >
              <RefreshCw size={16} className={isLoading || isRefreshingPaaS ? 'animate-pulse' : ''} />
            </button>
          </div>
        </section>

        {/* Task Grid */}
        <section>
          {filteredTasks.length === 0 ? (
            <div className="glass-panel" style={{
              textAlign: 'center',
              padding: '4rem 1.5rem',
              borderRadius: 'var(--radius-lg)',
            }}>
              <FolderOpen size={48} color="#64748b" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Tidak ada tugas yang ditemukan
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? 'Coba sesuaikan kata kunci pencarian atau reset filter di atas.'
                  : 'Belum ada tugas kuliah yang terdaftar. Tambahkan tugas pertama Anda!'}
              </p>
              <button onClick={() => setIsTaskModalOpen(true)} className="btn btn-primary">
                <Plus size={16} />
                <span>Tambah Tugas Pertama</span>
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.25rem',
            }}>
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdateStatus={handleUpdateStatus}
                  onDelete={handleDeleteTask}
                  onPreviewImage={(url, name) => setPreviewImage({ url, name })}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(10, 13, 20, 0.95)',
        padding: '2rem 0',
        marginTop: '4rem',
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.82rem',
          color: 'var(--text-muted)',
        }}>
          <div>
            <p>
              <strong>StudyTrack PaaS</strong> — Multi-Cloud Architecture Task &amp; Study Hub
            </p>
            <p style={{ marginTop: '0.25rem', fontSize: '0.75rem' }}>
              Hosting by <strong>Vercel</strong> • Database by <strong>Supabase</strong> • Storage by <strong>Cloudinary</strong>
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <button
              onClick={() => setIsArchitectureModalOpen(true)}
              style={{ color: '#818cf8', fontSize: '0.82rem', fontWeight: 600 }}
            >
              Panduan Arsitektur &amp; Deploy
            </button>
            <span>•</span>
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-secondary)' }}
            >
              Vercel Docs
            </a>
            <a
              href="https://supabase.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-secondary)' }}
            >
              Supabase Docs
            </a>
            <a
              href="https://cloudinary.com/documentation"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-secondary)' }}
            >
              Cloudinary Docs
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onAddTask={handleAddTask}
      />

      <PaaSArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />

      <ImagePreviewModal
        isOpen={Boolean(previewImage)}
        onClose={() => setPreviewImage(null)}
        imageUrl={previewImage?.url || null}
        imageName={previewImage?.name || ''}
      />
    </div>
  );
}
