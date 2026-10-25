'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, History, Calendar, FileText } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { auditService } from '@/lib/services/auditService';
import { ALL_DEPARTMENTS } from '@/lib/mock-data/users.seed';

export default function ActivityAuditPage() {
  const [logs] = useState(() => auditService.getAll());
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchSearch =
        log.userName.toLowerCase().includes(search.toLowerCase()) ||
        log.summary.toLowerCase().includes(search.toLowerCase()) ||
        log.recordId.toLowerCase().includes(search.toLowerCase());
      const matchDept = deptFilter === 'ALL' || log.department === deptFilter;
      const matchAction = actionFilter === 'ALL' || log.action === actionFilter;
      return matchSearch && matchDept && matchAction;
    });
  }, [logs, search, deptFilter, actionFilter]);

  return (
    <DashboardLayout superAdminOnly>
      <div className="space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--gold)]">
            Enterprise Audit Trail
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-main)]">
            System Activity & Mutation Logs ({filteredLogs.length})
          </h1>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search user, record ID or action..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[var(--surface-raised)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)]"
              />
            </div>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3 py-2 bg-[var(--surface-raised)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] cursor-pointer"
            >
              <option value="ALL">All Departments</option>
              {ALL_DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d.toUpperCase()}</option>
              ))}
              <option value="system">SYSTEM / AUTH</option>
            </select>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-3 py-2 bg-[var(--surface-raised)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] cursor-pointer"
            >
              <option value="ALL">All Actions</option>
              {['CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'STATUS_CHANGE', 'LOGIN'].map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </Card>

        {/* Logs Table */}
        <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[var(--surface-raised)] border-b border-[var(--border-color)] text-[var(--text-muted)] uppercase tracking-wider">
                <tr>
                  <th className="p-3.5 font-semibold">Timestamp</th>
                  <th className="p-3.5 font-semibold">User / Role</th>
                  <th className="p-3.5 font-semibold">Division</th>
                  <th className="p-3.5 font-semibold">Action</th>
                  <th className="p-3.5 font-semibold">Event Summary</th>
                  <th className="p-3.5 font-semibold">Before / After Snapshot</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {filteredLogs.slice(0, 50).map((log) => (
                  <tr key={log.id} className="hover:bg-[var(--surface-raised)]/40 transition-colors">
                    <td className="p-3.5 font-mono text-[var(--text-muted)] whitespace-nowrap">{log.timestamp}</td>
                    <td className="p-3.5">
                      <div className="font-semibold text-[var(--text-main)]">{log.userName}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">{log.userRole}</div>
                    </td>
                    <td className="p-3.5">
                      <Badge variant="neutral">{log.department.toUpperCase()}</Badge>
                    </td>
                    <td className="p-3.5">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[var(--surface-raised)] border border-[var(--border-color)] font-semibold">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <div className="font-medium text-[var(--text-main)] truncate">{log.summary}</div>
                      <div className="text-[10px] font-mono text-[var(--gold)]">{log.recordId}</div>
                    </td>
                    <td className="p-3.5 max-w-xs text-[11px]">
                      {log.beforeValue && <div className="text-rose-600 dark:text-rose-400 truncate">- {log.beforeValue}</div>}
                      {log.afterValue && <div className="text-emerald-600 dark:text-emerald-400 truncate">+ {log.afterValue}</div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
