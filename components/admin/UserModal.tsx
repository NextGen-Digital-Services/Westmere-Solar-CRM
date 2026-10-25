'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { User, Role, Department } from '@/types/auth';
import { ALL_DEPARTMENTS } from '@/lib/mock-data/users.seed';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Partial<User>) => void;
  user: User | null;
  managers: User[];
}

export function UserModal({ isOpen, onClose, onSave, user, managers }: UserModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<Role>('employee');
  const [department, setDepartment] = useState<Department>('sales');
  const [managerId, setManagerId] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
      setRole(user.role);
      setDepartment(user.department || 'sales');
      setManagerId(user.managerId || '');
      setStatus(user.status);
    } else {
      setName('');
      setEmail('');
      setPhone('+91 98200 ');
      setRole('employee');
      setDepartment('sales');
      setManagerId(managers[0]?.id || '');
      setStatus('active');
    }
  }, [user, managers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: user?.id,
      name,
      email,
      phone,
      role,
      department: role === 'super_admin' ? undefined : department,
      managerId: role === 'employee' ? managerId : undefined,
      status,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={user ? 'Edit Staff Account' : 'Provision New Staff Account'}>
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Corporate Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Mobile Contact" value={phone} onChange={(e) => setPhone(e.target.value)} required />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="System Role"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            options={[
              { label: 'Employee', value: 'employee' },
              { label: 'Department Manager', value: 'department_manager' },
              { label: 'Super Admin', value: 'super_admin' },
            ]}
          />
          {role !== 'super_admin' && (
            <Select
              label="Assigned Division"
              value={department}
              onChange={(e) => setDepartment(e.target.value as Department)}
              options={ALL_DEPARTMENTS.map((d) => ({ label: d.toUpperCase(), value: d }))}
            />
          )}
        </div>

        {role === 'employee' && (
          <Select
            label="Reporting Manager"
            value={managerId}
            onChange={(e) => setManagerId(e.target.value)}
            options={[
              { label: 'Select Manager...', value: '' },
              ...managers.map((m) => ({ label: `${m.name} (${m.department})`, value: m.id })),
            ]}
          />
        )}

        <Select
          label="Account Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
          options={[
            { label: 'Active', value: 'active' },
            { label: 'Deactivated / Suspended', value: 'inactive' },
          ]}
        />

        <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-color)]">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Save Account
          </Button>
        </div>
      </form>
    </Modal>
  );
}
