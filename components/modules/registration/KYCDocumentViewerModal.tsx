'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FileText, Upload, CheckCircle2, AlertCircle, FileCheck, Eye } from 'lucide-react';
import { RegistrationProject, DocumentType } from '@/types/registration';

interface KYCDocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: RegistrationProject | null;
  onUploadDoc: (projectId: string, type: DocumentType, fileName: string) => void;
  onVerifyDoc: (projectId: string, docId: string, status: 'Verified' | 'Rejected', reason?: string) => void;
}

const REQUIRED_DOCS: DocumentType[] = [
  'Electricity Bill',
  'Aadhaar Card',
  'Property Tax Receipt',
  'Rooftop Photo',
];

export function KYCDocumentViewerModal({
  isOpen,
  onClose,
  project,
  onUploadDoc,
  onVerifyDoc,
}: KYCDocumentViewerModalProps) {
  const [selectedType, setSelectedType] = useState<DocumentType>('Electricity Bill');
  const [mockFileName, setMockFileName] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingDocId, setRejectingDocId] = useState<string | null>(null);

  if (!project) return null;

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mockFileName) return;
    onUploadDoc(project.id, selectedType, mockFileName);
    setMockFileName('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`KYC Document Dossier — ${project.projectId}`} maxWidth="3xl">
      <div className="space-y-6 text-xs text-[var(--text-main)]">
        {/* Upload simulated box */}
        <form onSubmit={handleSimulateUpload} className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-color)] space-y-3">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[var(--gold)]">
            <Upload className="w-4 h-4" />
            Upload Verified Document / Missing Resubmission
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as DocumentType)}
              className="px-3 py-2 bg-[var(--surface)] border border-[var(--border-color)] rounded-xl text-xs cursor-pointer"
            >
              {REQUIRED_DOCS.map((doc) => (
                <option key={doc} value={doc}>{doc}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="e.g. Scanned_Aadhaar_Card_Signed.pdf"
              value={mockFileName}
              onChange={(e) => setMockFileName(e.target.value)}
              className="px-3 py-2 bg-[var(--surface)] border border-[var(--border-color)] rounded-xl text-xs sm:col-span-1"
              required
            />
            <Button type="submit" variant="primary" size="sm">
              Attach Document
            </Button>
          </div>
        </form>

        {/* Uploaded Documents List */}
        <div>
          <h4 className="font-serif font-bold text-sm mb-3">Submitted Application Documents ({project.documents.length})</h4>
          <div className="space-y-2">
            {project.documents.map((doc) => (
              <div key={doc.id} className="p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[var(--surface-raised)] border border-[var(--border-color)] text-[var(--primary)]">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[var(--text-main)]">{doc.type}</div>
                    <div className="text-[11px] text-[var(--text-muted)] font-mono">
                      {doc.fileName} • {doc.fileSize} • Uploaded {doc.uploadDate}
                    </div>
                    {doc.rejectionReason && (
                      <div className="text-[11px] text-rose-600 dark:text-rose-400 font-medium mt-0.5">
                        Correction needed: {doc.rejectionReason}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Badge variant={doc.status === 'Verified' ? 'success' : doc.status === 'Rejected' ? 'danger' : 'warning'}>
                    {doc.status}
                  </Badge>
                  {doc.status !== 'Verified' && (
                    <Button size="sm" variant="outline" onClick={() => onVerifyDoc(project.id, doc.id, 'Verified')}>
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Verify
                    </Button>
                  )}
                  {doc.status !== 'Rejected' && (
                    <Button size="sm" variant="outline" onClick={() => {
                      const reason = prompt('Enter rejection reason for customer correction:') || 'Document unreadable';
                      onVerifyDoc(project.id, doc.id, 'Rejected', reason);
                    }}>
                      <AlertCircle className="w-3.5 h-3.5 mr-1 text-rose-600" /> Reject
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
