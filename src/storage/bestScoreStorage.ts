import { getCloudStorage } from '../telegram/telegram';
import { BestScoreProvider, BestScoreProviderFactory } from './types';

const STORAGE_KEY = 'bestScore';

const parseScore = (value: string | null | undefined): number | null => {
  if (!value) return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const wrapCloudGet = (key: string): Promise<number | null> =>
  new Promise((resolve, reject) => {
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
      resolve(parseScore(value));
    });
  });

const wrapCloudSet = (key: string, score: number): Promise<void> =>
  new Promise((resolve, reject) => {
    const cloud = getCloudStorage();
    if (!cloud) {
      resolve();
      return;
    }
    cloud.setItem(key, String(score), (err) => {
      if (err) {
        reject(new Error(err));
        return;
      }
      resolve();
    });
  });

const createTelegramProvider = async (): Promise<BestScoreProvider | null> => {
  const cloud = getCloudStorage();
  if (!cloud) return null;
  return {
    get: () => wrapCloudGet(STORAGE_KEY),
    set: (score: number) => wrapCloudSet(STORAGE_KEY, score),
  };
};

const localBestScoreProvider: BestScoreProvider = {
  get: async () => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return null;
      return parseScore(window.localStorage.getItem(STORAGE_KEY));
    } catch {
      return null;
    }
  },
  set: async (score: number) => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      window.localStorage.setItem(STORAGE_KEY, String(score));
    } catch {
      // ignore write errors
    }
  },
};

export const createBestScoreStorage: BestScoreProviderFactory = async () => {
  try {
    const telegramProvider = await createTelegramProvider();
    if (telegramProvider) return telegramProvider;
  } catch {
    // fall through to local storage
  }
  return localBestScoreProvider;
};

