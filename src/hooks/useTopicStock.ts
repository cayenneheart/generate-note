import { useState, useEffect, useCallback } from 'react';

export interface TopicCandidate {
  title: string;
  keyword: string;
  summary: string;
  relevance: number;
  source: string;
}

export interface TopicStockItem extends TopicCandidate {
  id: string;
  collectedAt: string;
  used: boolean;
}

const STORAGE_KEY = 'generate-note-topic-stock';
const STRATEGY_KEY = 'generate-note-topic-strategy';

function loadStock(): TopicStockItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStock(items: TopicStockItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save topic stock:', e);
  }
}

export function useTopicStock() {
  const [stock, setStock] = useState<TopicStockItem[]>(() => loadStock());
  const [strategy, setStrategyState] = useState(() =>
    localStorage.getItem(STRATEGY_KEY) || ''
  );
  const [isCollecting, setIsCollecting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    saveStock(stock);
  }, [stock]);

  const setStrategy = useCallback((value: string) => {
    setStrategyState(value);
    localStorage.setItem(STRATEGY_KEY, value);
  }, []);

  const addCandidates = useCallback((candidates: TopicCandidate[]) => {
    const newItems: TopicStockItem[] = candidates.map(c => ({
      ...c,
      id: `topic-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      collectedAt: new Date().toISOString(),
      used: false,
    }));
    setStock(prev => [...newItems, ...prev]);
  }, []);

  const markUsed = useCallback((id: string) => {
    setStock(prev => prev.map(t =>
      t.id === id ? { ...t, used: true } : t
    ));
  }, []);

  const removeItem = useCallback((id: string) => {
    setStock(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setStock([]);
  }, []);

  const collect = useCallback(async () => {
    if (!strategy.trim()) {
      setError('収集方針を入力してください');
      return;
    }

    setIsCollecting(true);
    setError('');

    try {
      // Extract keywords from strategy using simple split
      const keywords = strategy
        .split(/[、,\s]+/)
        .filter(k => k.trim().length > 0)
        .slice(0, 5); // max 5 keywords

      const res = await fetch('http://localhost:3001/api/x-collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strategy, keywords }),
      });

      const data = await res.json();

      if (!data.ok) {
        throw new Error(data.error || 'ネタ収集に失敗しました');
      }

      addCandidates(data.candidates);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'エラーが発生しました';
      setError(message);
    } finally {
      setIsCollecting(false);
    }
  }, [strategy, addCandidates]);

  const login = useCallback(async (authToken: string, ct0?: string) => {
    setError('');
    try {
      const res = await fetch('http://localhost:3001/api/x-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authToken, ct0 }),
      });
      const data = await res.json();
      if (!data.ok) {
        throw new Error(data.error || 'Cookie保存に失敗しました');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'エラーが発生しました';
      setError(message);
      throw err;
    }
  }, []);

  return {
    stock,
    strategy,
    setStrategy,
    isCollecting,
    error,
    collect,
    login,
    markUsed,
    removeItem,
    clearAll,
  };
}
