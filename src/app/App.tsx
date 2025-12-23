import React, { useEffect, useMemo } from 'react';
import { Board } from '../ui/Board';
import { ScorePanel } from '../ui/ScorePanel';
import { useGame } from '../hooks/useGame';
import { useSwipe } from '../hooks/useSwipe';
import { useBestScore } from '../hooks/useBestScore';
import { createBestScoreStorage } from '../storage/bestScoreStorage';
import { createGameStateStorage } from '../storage/gameStateStorage';
import { Direction } from '../game/types';
import styles from './styles/App.module.css';
import { getWebApp } from '../telegram/telegram';

const useRng = () => useMemo<() => number>(() => () => Math.random(), []);

const useKeyboard = (onDirection: (dir: Direction) => void) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const code = e.code;

      // Layout-independent mapping (physical keys and arrows)
      const codeMap: Record<string, Direction> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        KeyW: 'up',
        KeyA: 'left',
        KeyS: 'down',
        KeyD: 'right',
      };

      let dir: Direction | undefined = code ? codeMap[code] : undefined;

      // Fallback by character (for older browsers / non-standard layouts)
      if (!dir) {
        const key = e.key;
        const normalized = typeof key === 'string' ? key.toLowerCase() : '';
        const keyMap: Record<string, Direction> = {
          arrowup: 'up',
          arrowdown: 'down',
          arrowleft: 'left',
          arrowright: 'right',
          w: 'up',
          ц: 'up',
          a: 'left',
          ф: 'left',
          s: 'down',
          ы: 'down',
          d: 'right',
          в: 'right',
        };
        dir = keyMap[normalized];
      }

      if (dir) {
        e.preventDefault();
        onDirection(dir);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onDirection]);
};

export const App = () => {
  const rng = useRng();
  const [gameStorage, setGameStorage] = React.useState<Awaited<
    ReturnType<typeof createGameStateStorage>
  > | null>(null);

  React.useEffect(() => {
    createGameStateStorage()
      .then(setGameStorage)
      .catch(() => {
        setGameStorage(null);
      });
  }, []);

  const { state, move, restart } = useGame(rng, gameStorage ?? undefined);
  const bestScore = useBestScore({ factory: createBestScoreStorage, currentScore: state.score });

  const handleMove = (direction: Direction) => {
    move(direction);
    const webApp = getWebApp();
    webApp?.HapticFeedback?.impactOccurred('light');
  };

  useSwipe({ onSwipe: handleMove });
  useKeyboard(handleMove);

  const status = state.isOver ? 'Game Over' : state.hasWon ? 'You win!' : null;

  return (
    <div className={styles.app}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>2048</div>
          <ScorePanel score={state.score} bestScore={bestScore} />
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.button} onClick={restart}>
            Restart
          </button>
        </div>
      </div>

      <Board grid={state.grid} />

      {status ? <div className={styles.status}>{status}</div> : null}
    </div>
  );
};

