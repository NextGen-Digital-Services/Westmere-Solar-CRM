'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { RegistrationProject, RegistrationStatus } from '@/types/registration';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Partial<RegistrationProject>) => void;
  project: RegistrationProject | null;
  employees: Array<{ id: string; name: string }>;
}

export function ProjectModal({ isOpen, onClose, onSave, project, employees }: ProjectModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [siteAddress, setSiteAddress] = useState('');
  const [city, setCity] = useState('Pune');
  const [consumerNumber, setConsumerNumber] = useState('');
  const [discomName, setDiscomName] = useState('MSEDCL');
  const [sanctionedLoadKW, setSanctionedLoadKW] = useState(6);
  const [proposedCapacityKW, setProposedCapacityKW] = useState(5);
  const [status, setStatus] = useState<RegistrationStatus>('Pending');
  const [assignedEmployeeId, setAssignedEmployeeId] = useState('');

  useEffect(() => {
    if (project) {
      setCustomerName(project.customerName);
      setPhone(project.phone);
      setEmail(project.email);
      setSiteAddress(project.siteAddress);
      setCity(project.city);
      setConsumerNumber(project.consumerNumber);
      setDiscomName(project.discomName);
      setSanctionedLoadKW(project.sanctionedLoadKW);
      setProposedCapacityKW(project.proposedCapacityKW);
      setStatus(project.status);
      setAssignedEmployeeId(project.assignedEmployeeId);
    } else {
      setCustomerName('');
      setPhone('+91 98220 ');
      setEmail('');
      setSiteAddress('');
      setCity('Pune');
      setConsumerNumber(`DISCOM-${Math.floor(700000 + Math.random() * 200000)}`);
      setDiscomName('MSEDCL');
      setSanctionedLoadKW(6);
      setProposedCapacityKW(5);
      setStatus('Pending');
      setAssignedEmployeeId(employees[0]?.id || '');
    }
  }, [project, employees]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((x) => x.id === assignedEmployeeId);
    onSave({
      id: project?.id,
      customerName,
      phone,
      email,
      siteAddress,
      city,
      consumerNumber,
      discomName,
      sanctionedLoadKW: Number(sanctionedLoadKW),
      proposedCapacityKW: Number(proposedCapacityKW),
      status,
      assignedEmployeeId,
      assignedEmployeeName: emp?.name || 'Vikram Singh',
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={project ? `Edit Project: ${project.projectId}` : 'New Customer Registration'} maxWidth="2xl">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Customer Full Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
          <Input label="Contact Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Site Address" value={siteAddress} onChange={(e) => setSiteAddress(e.target.value)} required />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} required />
          <Input label="Electricity Consumer No" value={consumerNumber} onChange={(e) => setConsumerNumber(e.target.value)} required />
          <Select
            label="Electric DISCOM"
            value={discomName}
            onChange={(e) => setDiscomName(e.target.value)}
            options={[
              { label: 'MSEDCL (Maharashtra)', value: 'MSEDCL' },
              { label: 'Tata Power Mumbai', value: 'Tata Power Mumbai' },
              { label: 'Adani Electricity Mumbai', value: 'Adani Electricity' },
              { label: 'Torrent Power (Gujarat)', value: 'Torrent Power' },
              { label: 'BESCOM (Bengaluru)', value: 'BESCOM' },
            ]}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input label="Sanctioned Load (kW)" type="number" value={sanctionedLoadKW} onChange={(e) => setSanctionedLoadKW(Number(e.target.value))} required />
          <Input label="Proposed Solar (kW)" type="number" value={proposedCapacityKW} onChange={(e) => setProposedCapacityKW(Number(e.target.value))} required />
          <Select
            label="KYC Application Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            options={[
              { label: 'Pending Review', value: 'Pending' },
              { label: 'Submitted to DISCOM', value: 'Submitted' },
              { label: 'Approved & Sanctioned', value: 'Approved' },
              { label: 'Rejected / Corrections', value: 'Rejected' },
            ]}
          />
        </div>
        <Select
          label="Assigned Registration Officer"
          value={assignedEmployeeId}
          onChange={(e) => setAssignedEmployeeId(e.target.value)}
          options={employees.map((emp) => ({ label: emp.name, value: emp.id }))}
        />
        <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-color)]">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Save Project Dossier
          </Button>
        </div>
      </form>
    </Modal>
  );
}
