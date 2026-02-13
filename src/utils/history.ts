export interface PhotoSession {
  id: string;
  timestamp: number;
  thumbnail: string;
  settings: {
    passportSize: string;
    zoom: number;
    rotation: number;
    backgroundColor: string;
    brightness: number;
    contrast: number;
    saturation: number;
    panX: number;
    panY: number;
  };
  image: string;
}

const HISTORY_KEY = 'passport_photo_history';
const MAX_HISTORY_ITEMS = 20;

export function saveToHistory(session: Omit<PhotoSession, 'id' | 'timestamp'>): void {
  try {
    const history = getHistory();
    const newSession: PhotoSession = {
      ...session,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    // Add to beginning of array
    history.unshift(newSession);

    // Keep only MAX_HISTORY_ITEMS
    const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);

    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('Failed to save to history:', error);
  }
}

export function getHistory(): PhotoSession[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
}

export function deleteHistoryItem(id: string): void {
  try {
    const history = getHistory();
    const filtered = history.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete history item:', error);
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
}

export function getHistoryStats(): { count: number; oldestDate: number | null; newestDate: number | null } {
  const history = getHistory();
  return {
    count: history.length,
    oldestDate: history.length > 0 ? history[history.length - 1].timestamp : null,
    newestDate: history.length > 0 ? history[0].timestamp : null,
  };
}
