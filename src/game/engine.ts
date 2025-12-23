import { applyMove } from './moves';
import { spawnTile } from './spawn';
import { canMove, getMaxTileValue } from './selectors';
import { Direction, GameState, MoveResult, RNG } from './types';

const hasWonAtValue = 2048;

const emptyGrid = (): GameState['grid'] => Array(16).fill(null);

export const initGame = (rng: RNG): GameState => {
  let grid = emptyGrid();
  grid = spawnTile(grid, rng).grid;
  grid = spawnTile(grid, rng).grid;
  return {
    grid,
    score: 0,
    isOver: false,
    hasWon: false,
  };
};

export const move = (state: GameState, direction: Direction, rng: RNG): MoveResult => {
  if (state.isOver) {
    return { state, moved: false, scoreGained: 0 };
  }

  const { grid: movedGrid, moved, scoreGained } = applyMove(state.grid, direction, rng);

  if (!moved) {
    return { state, moved: false, scoreGained: 0 };
  }

  const updatedScore = state.score + scoreGained;
  const maxTile = getMaxTileValue(movedGrid);
  const hasWon = state.hasWon || maxTile >= hasWonAtValue;

  let nextGrid = movedGrid;
  let spawnedTile;
  try {
    const spawnResult = spawnTile(movedGrid, rng);
    nextGrid = spawnResult.grid;
    spawnedTile = spawnResult.spawned;
  } catch {
    // no empty cells, will evaluate isOver below
  }

  const isOver = !canMove(nextGrid);

  return {
    state: {
      grid: nextGrid,
      score: updatedScore,
      isOver,
      hasWon,
    },
    moved: true,
    scoreGained,
    spawnedTile,
  };
};

