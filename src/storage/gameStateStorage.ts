import { getCloudStorage } from '../telegram/telegram';
import { GameStateStorage, GameStateStorageFactory } from './types';

const STORAGE_KEY = 'gameState';

const cloudGet = (key: string) =>
  new Promise<string | null>((resolve, reject) => {
    const cloud = getCloudStorage();
    if (!cloud) {
      resolve(null);
      return;
    }
    cloud.getItem(key, (err, value) => {
      if (err) {
        reject(new Error(err));
        return;
      }
      resolve(value ?? null);
    });
  });

const cloudSet = (key: string, value: string) =>
  new Promise<void>((resolve, reject) => {
    const cloud = getCloudStorage();
    if (!cloud) {
      resolve();
      return;
    }
    cloud.setItem(key, value, (err) => {
      if (err) {
        reject(new Error(err));
        return;
      }
      resolve();
    });
  });

const telegramStorage: GameStateStorage = {
  get: () => cloudGet(STORAGE_KEY),
  set: (state: string) => cloudSet(STORAGE_KEY, state),
  clear: () => cloudSet(STORAGE_KEY, ''),
};

const localStorageProvider: GameStateStorage = {
  get: async () => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return null;
      return window.localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  },
  set: async (state: string) => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      window.localStorage.setItem(STORAGE_KEY, state);
    } catch {
      /* ignore */
    }
  },
  clear: async () => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  },
};

export const createGameStateStorage: GameStateStorageFactory = async () => {
  try {
    const cloud = getCloudStorage();
    if (cloud) return telegramStorage;
  } catch {
    // ignore
  }
  return localStorageProvider;
};

