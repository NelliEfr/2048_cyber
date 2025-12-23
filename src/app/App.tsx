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
      const dirMap: Record<string, Direction> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
      };
      const dir = dirMap[e.key];
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

