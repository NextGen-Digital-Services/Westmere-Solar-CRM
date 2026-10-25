'use client';

import React, { useState } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Save } from 'lucide-react';
import { useToast } from '@/components/providers/ToastProvider';

export function PasswordChangeForm() {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const { success } = useToast();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      alert('New passwords do not match');
      return;
    }
    success('Password updated successfully.');
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  return (
    <Card>
      <CardHeader title="Update Security Password" subtitle="Universal demo credentials remain active across sessions" />
      <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md text-xs mt-3">
        <Input
          label="Current Password"
          type="password"
          placeholder="••••••••"
          value={currentPass}
          onChange={(e) => setCurrentPass(e.target.value)}
          required
        />
        <Input
          label="New Secure Password"
          type="password"
          placeholder="••••••••"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
          required
        />
        <Input
          label="Confirm New Password"
          type="password"
          placeholder="••••••••"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
          required
        />
        <Button type="submit" variant="primary" size="sm">
          <Save className="w-4 h-4 mr-1.5" /> Update Password
        </Button>
      </form>
    </Card>
  );
}
