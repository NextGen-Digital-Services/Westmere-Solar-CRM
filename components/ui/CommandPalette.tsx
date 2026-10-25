'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, User, Folder, Package, ArrowRight } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { salesService } from '@/lib/services/salesService';
import { registrationService } from '@/lib/services/registrationService';
import { inventoryService } from '@/lib/services/inventoryService';

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const results: Array<{ id: string; title: string; category: string; link: string; icon: any }> = [];

    if (user?.role === 'super_admin' || user?.department === 'sales') {
      salesService.getLeads().forEach((l) => {
        if (l.customerName.toLowerCase().includes(q) || l.phone.includes(q) || l.city.toLowerCase().includes(q)) {
          results.push({ id: l.id, title: `${l.customerName} (${l.capacityKW} kW — ${l.city})`, category: 'Sales Leads', link: `/sales?lead=${l.id}`, icon: User });
        }
      });
    }

    if (user?.role === 'super_admin' || user?.department === 'registration' || user?.department === 'finance') {
      registrationService.getProjects().forEach((p) => {
        if (p.projectId.toLowerCase().includes(q) || p.customerName.toLowerCase().includes(q)) {
          results.push({ id: p.id, title: `${p.projectId}: ${p.customerName}`, category: 'Registration', link: `/registration?project=${p.id}`, icon: Folder });
        }
      });
    }

    if (user?.role === 'super_admin' || user?.department === 'inventory') {
      inventoryService.getStockItems().forEach((s) => {
        if (s.name.toLowerCase().includes(q) || s.sku.toLowerCase().includes(q)) {
          results.push({ id: s.id, title: `${s.sku} — ${s.name}`, category: 'Inventory', link: `/inventory?item=${s.id}`, icon: Package });
        }
      });
    }
    return results.slice(0, 8);
  }, [query, user]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in-0 duration-150">
        <div className="flex items-center px-4 border-b border-[var(--border-color)]">
          <Search className="w-5 h-5 text-[var(--text-muted)] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, customer name, project ID or SKU..."
            className="w-full bg-transparent px-3 py-4 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none"
            autoFocus
          />
          <button onClick={onClose} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {query.trim().length === 0 ? (
            <div className="py-8 text-center text-xs text-[var(--text-muted)]">
              Search leads, projects, solar components and permitted records.
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-8 text-center text-xs text-[var(--text-muted)]">No matching records found for "{query}".</div>
          ) : (
            <div className="space-y-1">
              {searchResults.map((res) => {
                const Icon = res.icon;
                return (
                  <button
                    key={`${res.category}-${res.id}`}
                    onClick={() => { router.push(res.link); onClose(); }}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[var(--surface-raised)] text-left transition-colors text-sm group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[var(--surface-raised)] border border-[var(--border-color)] text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-[var(--text-main)]">{res.title}</div>
                        <div className="text-[11px] text-[var(--text-muted)]">{res.category}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
