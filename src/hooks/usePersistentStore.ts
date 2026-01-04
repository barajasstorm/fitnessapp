import { useState, useEffect, useCallback } from 'react';
import type { AppData, UserSettings, DailyEntry } from '../types';

const STORAGE_KEY = 'weight-tracker-v1';

const getDefaultData = (): AppData => ({
  settings: null,
  entries: [],
});

const loadFromStorage = (): AppData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return getDefaultData();
    
    const parsed = JSON.parse(stored);
    return {
      settings: parsed.settings || null,
      entries: Array.isArray(parsed.entries) ? parsed.entries : [],
    };
  } catch (error) {
    console.error('Failed to load data from localStorage:', error);
    return getDefaultData();
  }
};

const saveToStorage = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save data to localStorage:', error);
  }
};

export const usePersistentStore = () => {
  const [data, setData] = useState<AppData>(loadFromStorage);

  useEffect(() => {
    saveToStorage(data);
  }, [data]);

  const updateSettings = useCallback((settings: UserSettings) => {
    setData(prev => ({
      ...prev,
      settings,
    }));
  }, []);

  const upsertEntry = useCallback((entry: DailyEntry) => {
    setData(prev => {
      const existingIndex = prev.entries.findIndex(e => e.date === entry.date);
      let newEntries: DailyEntry[];
      
      if (existingIndex >= 0) {
        // Update existing entry
        newEntries = [...prev.entries];
        newEntries[existingIndex] = entry;
      } else {
        // Add new entry
        newEntries = [...prev.entries, entry];
      }
      
      // Sort by date descending
      newEntries.sort((a, b) => b.date.localeCompare(a.date));
      
      return {
        ...prev,
        entries: newEntries,
      };
    });
  }, []);

  const getEntryByDate = useCallback((date: string): DailyEntry | undefined => {
    return data.entries.find(e => e.date === date);
  }, [data.entries]);

  const getAllEntries = useCallback((): DailyEntry[] => {
    return [...data.entries];
  }, [data.entries]);

  return {
    settings: data.settings,
    entries: data.entries,
    updateSettings,
    upsertEntry,
    getEntryByDate,
    getAllEntries,
  };
};

