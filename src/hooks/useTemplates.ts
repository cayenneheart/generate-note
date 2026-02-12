import { useState, useEffect, useCallback } from 'react';
import type { Template } from '../types';

const STORAGE_KEY = 'generate-note-templates';

function loadTemplates(): Template[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTemplates(items: Template[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save templates:', e);
  }
}

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>(() => loadTemplates());

  useEffect(() => {
    saveTemplates(templates);
  }, [templates]);

  const addTemplate = useCallback((name: string, content: string) => {
    const item: Template = {
      id: `tmpl-${Date.now()}`,
      name,
      content,
      createdAt: new Date().toISOString(),
    };
    setTemplates(prev => [...prev, item]);
    return item;
  }, []);

  const updateTemplate = useCallback((id: string, name: string, content: string) => {
    setTemplates(prev => prev.map(t =>
      t.id === id ? { ...t, name, content } : t
    ));
  }, []);

  const removeTemplate = useCallback((id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  }, []);

  return { templates, addTemplate, updateTemplate, removeTemplate };
}
