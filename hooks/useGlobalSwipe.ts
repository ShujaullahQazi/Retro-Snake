import { useEffect, useRef } from 'react';
import { Direction } from '../types';
import { SWIPE_THRESHOLD } from '../constants';

export const useGlobalSwipe = (onSwipe: (dir: Direction) => void) => {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      const diffX = e.changedTouches[0].clientX - touchStartRef.current.x;
      const diffY = e.changedTouches[0].clientY - touchStartRef.current.y;

      // Reset touch start to prevent stale references
      touchStartRef.current = null;

      // Ignore slight taps or jitters below threshold
      if (Math.abs(diffX) < SWIPE_THRESHOLD && Math.abs(diffY) < SWIPE_THRESHOLD) {
        return;
      }

      // Determine primary axis and direction
      if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal
        onSwipe(diffX > 0 ? Direction.RIGHT : Direction.LEFT);
      } else {
        // Vertical
        onSwipe(diffY > 0 ? Direction.DOWN : Direction.UP);
      }
    };

    // Attach to window so controls work anywhere on screen
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipe]);
};