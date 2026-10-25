import { NotificationItem } from '@/types/notification';
import { Department } from '@/types/auth';
import { INITIAL_NOTIFICATIONS } from '@/lib/mock-data/notifications.seed';
import { getStoredData, setStoredData } from './storage';

const NOTIFICATIONS_KEY = 'solarcrm_notifications';

export const notificationService = {
  getNotifications: (dept?: Department): NotificationItem[] => {
    const list = getStoredData<NotificationItem[]>(NOTIFICATIONS_KEY, INITIAL_NOTIFICATIONS);
    if (!dept) return list;
    return list.filter((n) => n.department === dept);
  },

  markAsRead: (id: string): void => {
    const list = getStoredData<NotificationItem[]>(NOTIFICATIONS_KEY, INITIAL_NOTIFICATIONS);
    const idx = list.findIndex((n) => n.id === id);
    if (idx !== -1) {
      list[idx].isRead = true;
      setStoredData(NOTIFICATIONS_KEY, list);
    }
  },

  markAllRead: (dept?: Department): void => {
    const list = getStoredData<NotificationItem[]>(NOTIFICATIONS_KEY, INITIAL_NOTIFICATIONS);
    const updated = list.map((n) => {
      if (!dept || n.department === dept) {
        return { ...n, isRead: true };
      }
      return n;
    });
    setStoredData(NOTIFICATIONS_KEY, updated);
  },

  getUnreadCount: (dept?: Department): number => {
    return notificationService.getNotifications(dept).filter((n) => !n.isRead).length;
  },
};
