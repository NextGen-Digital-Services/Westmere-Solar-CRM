'use client';

import React from 'react';
import {
  UserCheck,
  FileCheck,
  CreditCard,
  Boxes,
  Wrench,
  Zap,
  Award,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';

export type LifecycleStageKey =
  | 'lead'
  | 'registration'
  | 'payment'
  | 'material'
  | 'installation'
  | 'inspection'
  | 'subsidy';

export interface StageStatus {
  key: LifecycleStageKey;
  label: string;
  status: 'completed' | 'in_progress' | 'pending' | 'blocked';
  detail?: string;
  date?: string;
}

interface ProjectTimelineProps {
  projectId: string;
  customerName?: string;
  stages?: StageStatus[];
}

export function ProjectTimeline({ projectId, customerName, stages }: ProjectTimelineProps) {
  const defaultStages: StageStatus[] = [
    { key: 'lead', label: 'Lead & Proposal', status: 'completed', detail: 'Quotation Accepted', date: '2026-10-08' },
    { key: 'registration', label: 'Customer Registration', status: 'completed', detail: 'KYC Verified (SOL-2026)', date: '2026-10-12' },
    { key: 'payment', label: 'Advance Payment', status: 'completed', detail: '₹50,000 Received via NEFT', date: '2026-10-15' },
    { key: 'material', label: 'Material Dispatch', status: 'completed', detail: '10 Panels & Inverter Dispatched', date: '2026-10-18' },
    { key: 'installation', label: 'Site Installation', status: 'in_progress', detail: 'Mounting Done, Wiring Active', date: '2026-10-22' },
    { key: 'inspection', label: 'Electrical Safety', status: 'pending', detail: 'Safety test scheduled' },
    { key: 'subsidy', label: 'PM Surya Ghar Subsidy', status: 'pending', detail: 'Awaiting completion certificate' },
  ];

  const stageList = stages || defaultStages;

  const stageIcons = {
    lead: UserCheck,
    registration: FileCheck,
    payment: CreditCard,
    material: Boxes,
    installation: Wrench,
    inspection: Zap,
    subsidy: Award,
  };

  return (
    <div className="w-full bg-[var(--surface)] border border-[var(--border-color)] rounded-xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <div>
          <span className="text-xs uppercase font-semibold text-[var(--gold)] tracking-wider">
            Lifecycle Progress Tracker
          </span>
          <h4 className="font-serif text-base sm:text-lg font-bold text-[var(--text-main)]">
            Project Stage: {projectId} {customerName ? `— ${customerName}` : ''}
          </h4>
        </div>
      </div>

      <div className="relative">
        <div className="overflow-x-auto pb-4">
          <div className="flex items-start min-w-[720px] justify-between relative">
            {stageList.map((st, idx) => {
              const Icon = stageIcons[st.key] || Clock;
              const isDone = st.status === 'completed';
              const isCurrent = st.status === 'in_progress';
              const isBlocked = st.status === 'blocked';

              return (
                <div key={st.key} className="flex-1 flex flex-col items-center relative px-2">
                  {/* Connecting bar */}
                  {idx < stageList.length - 1 && (
                    <div
                      className={`absolute top-5 left-1/2 w-full h-0.5 z-0 ${
                        isDone ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-[var(--border-color)]'
                      }`}
                    />
                  )}

                  {/* Icon circle */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border transition-all ${
                      isDone
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : isCurrent
                        ? 'bg-[var(--accent)] text-white border-[var(--accent)] ring-4 ring-[#FBF0EB] dark:ring-[#2D1D16]'
                        : isBlocked
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-[var(--surface-raised)] text-[var(--text-muted)] border-[var(--border-color)]'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-5 h-5" /> : isBlocked ? <AlertCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>

                  {/* Label */}
                  <span className="text-xs font-semibold text-center text-[var(--text-main)] mt-2">
                    {st.label}
                  </span>
                  {st.detail && (
                    <span className="text-[11px] text-[var(--text-muted)] text-center max-w-[100px] mt-0.5 truncate">
                      {st.detail}
                    </span>
                  )}
                  {st.date && (
                    <span className="text-[10px] font-mono text-[var(--gold)] mt-0.5">{st.date}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
