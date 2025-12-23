// Minimal Telegram WebApp helpers. This module should stay UI-agnostic.

export type CloudStorage = {
  getItem: (key: string, callback: (err?: string, value?: string) => void) => void;
  setItem: (key: string, value: string, callback: (err?: string) => void) => void;
};

export type TelegramWebApp = {
  ready?: () => void;
  expand?: () => void;
  initDataUnsafe?: unknown;
  colorScheme?: string;
  themeParams?: Record<string, unknown>;
  HapticFeedback?: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy') => void;
  };
  cloudStorage?: CloudStorage;
  onEvent?: (event: string, handler: (...args: unknown[]) => void) => void;
  offEvent?: (event: string, handler: (...args: unknown[]) => void) => void;
};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export const getWebApp = (): TelegramWebApp | null => window.Telegram?.WebApp ?? null;

export const getCloudStorage = (): CloudStorage | null => getWebApp()?.cloudStorage ?? null;

