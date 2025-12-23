import { PropsWithChildren, useEffect } from 'react';
import { getWebApp } from '../../telegram/telegram';

export const TelegramProvider = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    const webApp = getWebApp();
    webApp?.ready?.();
    webApp?.expand?.();
    // Theme sync or other events can be added here.
  }, []);

  return children;
};

