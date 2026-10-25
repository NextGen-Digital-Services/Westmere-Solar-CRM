'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Bell, Check, ExternalLink, AlertTriangle, AlertCircle, Info, Clock } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { notificationService } from '@/lib/services/notificationService';
import { NotificationItem } from '@/types/notification';

export function NotificationDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (isOpen && user) {
      const dept = user.role === 'super_admin' ? undefined : user.department;
      setNotifications(notificationService.getNotifications(dept));
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    const dept = user?.role === 'super_admin' ? undefined : user?.department;
    notificationService.markAllRead(dept);
    setNotifications(notificationService.getNotifications(dept));
  };

  const handleItemClick = (n: NotificationItem) => {
    notificationService.markAsRead(n.id);
    onClose();
    router.push(n.linkUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-[var(--surface)] border-l border-[var(--border-color)] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[var(--gold)]" />
            <h3 className="font-serif text-lg font-semibold text-[var(--text-main)]">
              Notifications & Alerts
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-[var(--primary)] hover:underline font-medium px-2 py-1"
            >
              Mark all read
            </button>
            <button onClick={onClose} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)]">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[var(--border-color)]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-[var(--text-muted)]">
              No notifications for your department at this time.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleItemClick(n)}
                className={`p-4 cursor-pointer hover:bg-[var(--surface-raised)] transition-colors flex gap-3 ${
                  !n.isRead ? 'bg-[var(--primary-light)]/40 dark:bg-[var(--primary-light)]/10' : ''
                }`}
              >
                <div className="mt-0.5">
                  {n.severity === 'critical' ? (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  ) : n.severity === 'high' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  ) : (
                    <Info className="w-4 h-4 text-[var(--primary)] shrink-0" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-xs sm:text-sm text-[var(--text-main)] truncate">
                      {n.title}
                    </span>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[var(--accent)] shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">{n.message}</p>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-[var(--text-muted)]">
                    <Clock className="w-3 h-3" />
                    <span>{n.createdAt}</span>
                    <span className="uppercase text-[9px] px-1.5 py-0.5 rounded-sm bg-[var(--surface-raised)] border border-[var(--border-color)] font-semibold">
                      {n.department}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
