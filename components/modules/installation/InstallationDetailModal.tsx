'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CheckSquare, Square, Upload, Printer, Camera, Wrench, AlertTriangle } from 'lucide-react';
import { InstallationTask } from '@/types/installation';

interface InstallationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: InstallationTask | null;
  onToggleChecklist: (taskId: string, checkId: string) => void;
  onAddPhoto: (taskId: string, photo: { title: string; url: string }) => void;
  onOpenReport: (task: InstallationTask) => void;
}

export function InstallationDetailModal({
  isOpen,
  onClose,
  task,
  onToggleChecklist,
  onAddPhoto,
  onOpenReport,
}: InstallationDetailModalProps) {
  const [photoTitle, setPhotoTitle] = useState('');

  if (!task) return null;

  const handleSimulatePhotoUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle) return;
    onAddPhoto(task.id, {
      title: photoTitle,
      url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=400&auto=format&fit=crop&q=60',
    });
    setPhotoTitle('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Site Installation Dossier: ${task.projectId}`} maxWidth="3xl">
      <div className="space-y-6 text-xs text-[var(--text-main)]">
        {/* Header summary */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-color)]">
          <div>
            <span className="font-bold text-sm text-[var(--text-main)]">{task.customerName}</span>
            <div className="text-[11px] text-[var(--text-muted)]">{task.siteAddress} • {task.systemCapacityKW} kW</div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={task.status === 'Commissioned' ? 'success' : task.isDelayed ? 'danger' : 'info'}>
              {task.status}
            </Badge>
            <Button size="sm" variant="outline" onClick={() => onOpenReport(task)}>
              <Printer className="w-3.5 h-3.5 mr-1" /> Printable Report
            </Button>
          </div>
        </div>

        {/* Delay alert banner */}
        {task.isDelayed && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-[#2D1616] border border-rose-200 dark:border-rose-900 flex items-start gap-2.5 text-rose-700 dark:text-rose-300">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div>
              <div className="font-bold">Execution Delayed by {task.delayDays || 2} Days</div>
              <div className="text-[11px] mt-0.5">Reason: {task.delayReason || 'Inclement weather or site inaccessibility'}</div>
            </div>
          </div>
        )}

        {/* Quality Checklist */}
        <div>
          <h4 className="font-serif font-bold text-sm mb-3">On-Site Commissioning Checklist</h4>
          <div className="space-y-2">
            {task.checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => onToggleChecklist(task.id, item.id)}
                className="p-3 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] hover:bg-[var(--surface-raised)] cursor-pointer flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  {item.completed ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Square className="w-4 h-4 text-[var(--text-muted)]" />
                  )}
                  <span className={item.completed ? 'line-through text-[var(--text-muted)]' : 'font-medium'}>
                    {item.label}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-semibold uppercase text-[var(--text-muted)]">
                  {item.completed ? 'Verified' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Work Completion Photos */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-serif font-bold text-sm">Site Progress & Proof Photos ({task.photos.length})</h4>
          </div>
          <form onSubmit={handleSimulatePhotoUpload} className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="e.g. Inverter ACDB Box Cable Dressing photo"
              value={photoTitle}
              onChange={(e) => setPhotoTitle(e.target.value)}
              className="flex-1 px-3 py-2 bg-[var(--surface-raised)] border border-[var(--border-color)] rounded-xl text-xs"
              required
            />
            <Button type="submit" variant="primary" size="sm">
              <Camera className="w-3.5 h-3.5 mr-1" /> Add Photo
            </Button>
          </form>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {task.photos.map((p) => (
              <div key={p.id} className="rounded-xl border border-[var(--border-color)] overflow-hidden bg-[var(--surface-raised)]">
                <img src={p.url} alt={p.title} className="w-full h-24 object-cover" />
                <div className="p-2 text-[10px] font-medium truncate">{p.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
