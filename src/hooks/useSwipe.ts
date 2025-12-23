import { useEffect, useRef } from 'react';
import { Direction } from '../game/types';

type SwipeOptions = {
  threshold?: number; // minimum px to count as swipe
  onSwipe: (direction: Direction) => void;
};

export const useSwipe = ({ threshold = 24, onSwipe }: SwipeOptions) => {
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStart.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStart.current.x;
      const dy = touch.clientY - touchStart.current.y;

      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      if (absX < threshold && absY < threshold) return;

      let direction: Direction;
      if (absX > absY) {
        direction = dx > 0 ? 'right' : 'left';
      } else {
        direction = dy > 0 ? 'down' : 'up';
      }
      onSwipe(direction);
      touchStart.current = null;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipe, threshold]);
};

