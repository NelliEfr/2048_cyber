import { CellIndex, Grid, RNG, SpawnedTile, Tile } from './types';
import { getEmptyCells } from './selectors';

const generateId = (rng: RNG): string =>
  Math.floor(rng() * 1e9)
    .toString(36)
    .padStart(6, '0');

export const createTile = (value: number, rng: RNG): Tile => ({
  id: generateId(rng),
  value,
});

export const spawnTile = (grid: Grid, rng: RNG): { grid: Grid; spawned: SpawnedTile } => {
  const empty = getEmptyCells(grid);
  if (empty.length === 0) {
    throw new Error('No empty cells to spawn a tile.');
  }

  const cellIndex = empty[Math.floor(rng() * empty.length)] as CellIndex;
  const value = rng() < 0.9 ? 2 : 4;
  const tile = createTile(value, rng);

  const nextGrid = grid.slice();
  nextGrid[cellIndex] = tile;

  return { grid: nextGrid, spawned: { index: cellIndex, tile } };
};

