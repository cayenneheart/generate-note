import { useState, useEffect, useCallback } from 'react';
import type { HistoryItem, ArticleSettings, GenerationResult } from '../types';

const STORAGE_KEY = 'generate-note-history';
const MAX_HISTORY = 50;

function loadHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(items: HistoryItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save history:', e);
  }
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>(() => loadHistory());

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const addItem = useCallback((settings: ArticleSettings, result: GenerationResult) => {
    const item: HistoryItem = {
      id: `hist-${Date.now()}`,
      keyword: settings.keyword,
      settings,
      result,
      createdAt: new Date().toISOString(),
    };
    setHistory(prev => [item, ...prev].slice(0, MAX_HISTORY));
  }, []);

  const removeItem = useCallback((id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setHistory([]);
  }, []);

  return { history, addItem, removeItem, clearAll };
}
