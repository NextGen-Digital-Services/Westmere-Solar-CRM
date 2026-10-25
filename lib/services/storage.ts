// Safe localStorage helper for browser environment
export function getStoredData<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Failed to read ${key} from localStorage:`, err);
    return fallback;
  }
}

export function setStoredData<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to write ${key} to localStorage:`, err);
  }
}

export function removeStoredData(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error(`Failed to remove ${key} from localStorage:`, err);
  }
}
