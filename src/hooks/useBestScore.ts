import { useEffect, useMemo, useState } from 'react';
import { BestScoreProviderFactory } from '../storage/types';

type UseBestScoreOptions = {
  factory: BestScoreProviderFactory;
  currentScore: number;
};

export const useBestScore = ({ factory, currentScore }: UseBestScoreOptions) => {
  const providerPromise = useMemo(() => factory(), [factory]);
  const [bestScore, setBestScore] = useState<number>(0);

  useEffect(() => {
    let mounted = true;
    providerPromise
      .then((provider) => provider.get())
      .then((stored) => {
        if (mounted && stored !== null && Number.isFinite(stored)) {
          setBestScore(stored);
        }
      })
      .catch(() => {
        /* ignore initial read errors */
      });
    return () => {
      mounted = false;
    };
  }, [providerPromise]);

  useEffect(() => {
    if (currentScore <= bestScore) return;
    setBestScore(currentScore);
    providerPromise
      .then((provider) => provider.set(currentScore))
      .catch(() => {
        /* ignore write errors */
      });
  }, [bestScore, currentScore, providerPromise]);

  return bestScore;
};

