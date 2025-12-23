export interface BestScoreProvider {
  get(): Promise<number | null>;
  set(score: number): Promise<void>;
}

// Factory will select Telegram CloudStorage first, then localStorage fallback.
export type BestScoreProviderFactory = () => Promise<BestScoreProvider>;

export interface GameStateStorage {
  get(): Promise<string | null>;
  set(state: string): Promise<void>;
  clear(): Promise<void>;
}

export type GameStateStorageFactory = () => Promise<GameStateStorage>;

