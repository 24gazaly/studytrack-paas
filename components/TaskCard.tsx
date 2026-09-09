'use client';

import React, { useState } from 'react';
import { Calendar, Clock, Paperclip, CheckCircle, Clock3, Circle, Trash2, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '@/lib/types';

interface TaskCardProps {
  task: Task;
  onUpdateStatus: (id: string, newStatus: TaskStatus) => void;
  onDelete: (id: string) => void;
  onPreviewImage: (url: string, name: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onUpdateStatus,
  onDelete,
  onPreviewImage,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const getPriorityBadgeClass = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent': return 'badge-urgent';
      case 'high': return 'badge-high';
      case 'medium': return 'badge-medium';
      case 'low': return 'badge-low';
      default: return 'badge-medium';
    }
  };

  const getStatusBadgeClass = (status: TaskStatus) => {
    switch (status) {
      case 'completed': return 'badge-completed';
      case 'in_progress': return 'badge-inprogress';
      case 'todo': return 'badge-todo';
    }
  };

  const formatDeadline = (deadlineStr?: string) => {
    if (!deadlineStr) return null;
    const date = new Date(deadlineStr);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    let relative = '';
    if (diffDays < 0) relative = '(Lewat deadline)';
    else if (diffDays === 0) relative = '(Hari ini)';
    else if (diffDays === 1) relative = '(Besok)';
    else relative = `(${diffDays} hari lagi)`;

    return {
      formatted: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      relative,
      isOverdue: diffDays < 0,
    };
  };

  const deadlineInfo = formatDeadline(task.deadline);

  return (
    <div className="glass-panel" style={{
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      opacity: task.status === 'completed' ? 0.78 : 1,
    }}>
      {/* Top Header */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.75rem',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}>
          {/* Course Name */}
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#a5b4fc',
            background: 'rgba(99, 102, 241, 0.1)',
            padding: '0.2rem 0.6rem',
            borderRadius: '6px',
            border: '1px solid rgba(99, 102, 241, 0.2)',
          }}>
            {task.course}
          </span>

          {/* Priority Badge */}
          <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
            {task.priority.toUpperCase()}
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '1.05rem',
          fontWeight: 700,
          lineHeight: 1.35,
          color: task.status === 'completed' ? '#94a3b8' : '#f8fafc',
          textDecoration: task.status === 'completed' ? 'line-through' : 'none',
          marginBottom: '0.5rem',
        }}>
          {task.title}
        </h3>

        {/* Description */}
        {task.description && (
          <p style={{
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            marginBottom: '1rem',
            lineHeight: 1.5,
          }}>
            {task.description}
          </p>
        )}

        {/* Cloudinary Attachment Preview */}
        {task.attachment_url && (
          <div style={{
            marginBottom: '1rem',
            background: 'rgba(0, 0, 0, 0.35)',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            overflow: 'hidden',
          }}>
            <button
              type="button"
              onClick={() => onPreviewImage(task.attachment_url!, task.attachment_name || 'Lampiran Cloudinary')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.6rem 0.85rem',
                color: '#38bdf8',
                textAlign: 'left',
                background: 'none',
              }}
            >
              <ImageIcon size={16} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {task.attachment_name || 'Lampiran Berkas (Cloudinary)'}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  Disimpan di Cloudinary Storage CDN
                </div>
              </div>
              <ExternalLink size={14} color="#94a3b8" />
            </button>
          </div>
        )}
      </div>

      {/* Card Footer: Deadline & Status Controls */}
      <div style={{
        marginTop: '1rem',
        paddingTop: '0.85rem',
        borderTop: '1px solid var(--border-subtle)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.75rem',
          fontSize: '0.75rem',
        }}>
          {/* Deadline */}
          {deadlineInfo ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: deadlineInfo.isOverdue ? '#f43f5e' : 'var(--text-secondary)',
            }}>
              <Calendar size={13} />
              <span>{deadlineInfo.formatted}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{deadlineInfo.relative}</span>
            </div>
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>Tanpa deadline</span>
          )}

          {/* Delete Button */}
          <button
            onClick={() => {
              if (confirm('Hapus tugas ini?')) {
                onDelete(task.id);
              }
            }}
            className="btn-icon"
            style={{
              width: '28px',
              height: '28px',
              color: 'var(--text-muted)',
              borderRadius: '6px',
            }}
            title="Hapus tugas"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Status Toggle Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.35rem',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '0.25rem',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)',
        }}>
          <button
            onClick={() => onUpdateStatus(task.id, 'todo')}
            style={{
              padding: '0.35rem',
              fontSize: '0.72rem',
              fontWeight: 600,
              borderRadius: '6px',
              background: task.status === 'todo' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
              color: task.status === 'todo' ? '#ffffff' : 'var(--text-muted)',
              transition: 'all 0.15s ease',
            }}
          >
            To Do
          </button>
          <button
            onClick={() => onUpdateStatus(task.id, 'in_progress')}
            style={{
              padding: '0.35rem',
              fontSize: '0.72rem',
              fontWeight: 600,
              borderRadius: '6px',
              background: task.status === 'in_progress' ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
              color: task.status === 'in_progress' ? '#a5b4fc' : 'var(--text-muted)',
              transition: 'all 0.15s ease',
            }}
          >
            In Progress
          </button>
          <button
            onClick={() => onUpdateStatus(task.id, 'completed')}
            style={{
              padding: '0.35rem',
              fontSize: '0.72rem',
              fontWeight: 600,
              borderRadius: '6px',
              background: task.status === 'completed' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
              color: task.status === 'completed' ? '#6ee7b7' : 'var(--text-muted)',
              transition: 'all 0.15s ease',
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
