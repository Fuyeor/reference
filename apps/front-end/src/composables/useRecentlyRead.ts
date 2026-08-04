// @/composables/useRecentlyRead.ts
import { ref } from 'vue';

export interface RecentPage {
  title: string;
  path: string;
  timestamp: number;
}

const storageKey = 'recentlyRead';
const maxEntries = 6;

const history = ref<RecentPage[]>([]);
let isLoaded = false; // Global flag to prevent duplicate localStorage reading

const loadHistory = () => {
  if (isLoaded) return; // Prevent duplicate reading if already loaded globally
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (raw) {
      history.value = JSON.parse(raw) as RecentPage[];
    }
    isLoaded = true;
  } catch (e) {
    console.error('[RecentlyRead] Failed to read from localStorage:', e);
  }
};

export function useRecentlyRead() {
  // Ensure history is loaded before we perform any array mutations
  loadHistory();

  const addHistory = (title: string, path: string) => {
    const filtered = history.value.filter((item) => item.path !== path);
    const updated = [{ title, path, timestamp: Date.now() }, ...filtered];

    history.value = updated.slice(0, maxEntries);

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(history.value));
    } catch (e) {
      console.error('[RecentlyRead] Failed to save to localStorage:', e);
    }
  };

  // Clears the entire reading history
  const clearHistory = () => {
    history.value = [];
    try {
      window.localStorage.removeItem(storageKey);
    } catch (e) {
      console.error('[RecentlyRead] Failed to clear localStorage:', e);
    }
  };

  return {
    history,
    addHistory,
    clearHistory,
  };
}
