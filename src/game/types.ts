export type BoardSize = 4;

export type CellIndex = number; // 0–15 for a 4x4 grid

export type Direction = 'up' | 'down' | 'left' | 'right';

// Deterministic RNG for testability; expected to return [0, 1)
export type RNG = () => number;

export interface Tile {
  id: string; // stable id per tile instance
  value: number; // powers of 2
  mergedFrom?: [string, string]; // ids of merged tiles (for UI animation)
}

export type Grid = (Tile | null)[]; // fixed length: 16

export interface GameState {
  grid: Grid;
  score: number;
  isOver: boolean;
  hasWon: boolean;
}

export interface SpawnedTile {
  index: CellIndex;
  tile: Tile;
}

export interface MoveResult {
  state: GameState;
  moved: boolean;
  scoreGained: number;
  spawnedTile?: SpawnedTile;
}

export interface MoveVectors {
  [direction: string]: { dx: number; dy: number };
}

