'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { InstallationTask, InstallationStatus } from '@/types/installation';

interface InstallationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<InstallationTask>) => void;
  task: InstallationTask | null;
}

export function InstallationModal({ isOpen, onClose, onSave, task }: InstallationModalProps) {
  const [projectId, setProjectId] = useState('SOL-2026-0001');
  const [customerName, setCustomerName] = useState('');
  const [siteAddress, setSiteAddress] = useState('');
  const [systemCapacityKW, setSystemCapacityKW] = useState(5);
  const [scheduledDate, setScheduledDate] = useState('');
  const [leadTechnician, setLeadTechnician] = useState('Manoj Tiwari');
  const [status, setStatus] = useState<InstallationStatus>('Scheduled');
  const [delayDays, setDelayDays] = useState(0);
  const [delayReason, setDelayReason] = useState('');

  useEffect(() => {
    if (task) {
      setProjectId(task.projectId);
      setCustomerName(task.customerName);
      setSiteAddress(task.siteAddress);
      setSystemCapacityKW(task.systemCapacityKW);
      setScheduledDate(task.scheduledDate);
      setLeadTechnician(task.leadTechnician);
      setStatus(task.status);
      setDelayDays(task.delayDays || 0);
      setDelayReason(task.delayReason || '');
    } else {
      setProjectId(`SOL-2026-${String(Math.floor(1 + Math.random() * 25)).padStart(4, '0')}`);
      setCustomerName('');
      setSiteAddress('');
      setSystemCapacityKW(5);
      setScheduledDate(new Date().toISOString().split('T')[0]);
      setLeadTechnician('Manoj Tiwari');
      setStatus('Scheduled');
      setDelayDays(0);
      setDelayReason('');
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: task?.id,
      projectId,
      customerName,
      siteAddress,
      systemCapacityKW: Number(systemCapacityKW),
      scheduledDate,
      leadTechnician,
      status,
      isDelayed: status === 'Delayed' || delayDays > 0,
      delayDays: Number(delayDays) || undefined,
      delayReason: delayReason || undefined,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? `Job Task: ${task.projectId}` : 'Schedule Installation Task'} maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <Input label="Project ID" value={projectId} onChange={(e) => setProjectId(e.target.value)} required />
        <Input label="Customer Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
        <Input label="Site Address" value={siteAddress} onChange={(e) => setSiteAddress(e.target.value)} required />

        <div className="grid grid-cols-2 gap-3">
          <Input label="System Capacity (kW)" type="number" value={systemCapacityKW} onChange={(e) => setSystemCapacityKW(Number(e.target.value))} required />
          <Input label="Deployment Date" type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} required />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Lead Site Technician"
            value={leadTechnician}
            onChange={(e) => setLeadTechnician(e.target.value)}
            options={[
              { label: 'Manoj Tiwari (Senior Tech)', value: 'Manoj Tiwari' },
              { label: 'Sandeep Kulkarni (Site Engineer)', value: 'Sandeep Kulkarni' },
              { label: 'Karthik Nair (Supervisor)', value: 'Karthik Nair' },
            ]}
          />
          <Select
            label="Workflow Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            options={[
              { label: 'Scheduled', value: 'Scheduled' },
              { label: 'Team Dispatched', value: 'Team Dispatched' },
              { label: 'Structure Assembled', value: 'Structure Assembled' },
              { label: 'Panels Mounted', value: 'Panels Mounted' },
              { label: 'Inverter Connected', value: 'Inverter Connected' },
              { label: 'Commissioned', value: 'Commissioned' },
              { label: 'Delayed', value: 'Delayed' },
            ]}
          />
        </div>

        {status === 'Delayed' && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-[#2D1616] border border-rose-200 dark:border-rose-900 space-y-2">
            <Input label="Delay in Days" type="number" value={delayDays} onChange={(e) => setDelayDays(Number(e.target.value))} required />
            <Input label="Delay Justification" placeholder="e.g. Incessant monsoon rain" value={delayReason} onChange={(e) => setDelayReason(e.target.value)} required />
          </div>
        )}

        <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-color)]">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Save Job
          </Button>
        </div>
      </form>
    </Modal>
  );
}
