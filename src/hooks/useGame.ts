import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { initGame, move as moveEngine } from '../game/engine';
import { Direction, GameState, RNG } from '../game/types';
import { GameStateStorage } from '../storage/types';

type Action =
  | { type: 'restart'; rng: RNG }
  | { type: 'move'; direction: Direction; rng: RNG }
  | { type: 'hydrate'; state: GameState };

const reducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'restart':
      return initGame(action.rng);
    case 'move': {
      const result = moveEngine(state, action.direction, action.rng);
      return result.state;
    }
    case 'hydrate':
      return action.state;
    default:
      return state;
  }
};

export const useGame = (rng: RNG, storage?: GameStateStorage) => {
  const initialState = useMemo(() => initGame(rng), [rng]);
  const [state, dispatch] = useReducer(reducer, initialState);
  const hydratedRef = useRef(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!storage) {
      setHydrated(true);
      return;
    }
    let cancelled = false;
    storage
      .get()
      .then((raw) => {
        if (cancelled) return;
        if (!raw) return;
        try {
          const parsed = JSON.parse(raw) as GameState;
          dispatch({ type: 'hydrate', state: parsed });
        } catch {
          /* ignore bad state */
        }
      })
      .catch(() => {
        /* ignore */
      })
      .finally(() => {
        if (!cancelled) {
          hydratedRef.current = true;
          setHydrated(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [storage]);

  useEffect(() => {
    if (!storage) return;
    if (!hydratedRef.current) return; // avoid saving immediately after load until hydration runs
    storage.set(JSON.stringify(state)).catch(() => {
      /* ignore */
    });
  }, [state, storage]);

  const move = useCallback(
    (direction: Direction) => {
      dispatch({ type: 'move', direction, rng });
    },
    [rng],
  );

  const restart = useCallback(() => {
    dispatch({ type: 'restart', rng });
    hydratedRef.current = true; // allow saving new state
  }, [rng]);

  return { state, move, restart, hydrated };
};

