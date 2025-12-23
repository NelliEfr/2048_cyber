import { Direction, Grid, RNG, Tile } from './types';
import { getLines } from './selectors';

const generateId = (rng: RNG): string =>
  Math.floor(rng() * 1e9)
    .toString(36)
    .padStart(6, '0');

type LineResult = {
  line: (Tile | null)[];
  moved: boolean;
  scoreGained: number;
};

const stripMergeMetadata = (tile: Tile): Tile => ({ ...tile, mergedFrom: undefined });

const slideLine = (line: (Tile | null)[], rng: RNG): LineResult => {
  const tiles = line.filter((cell): cell is Tile => cell !== null).map(stripMergeMetadata);
  const result: (Tile | null)[] = [];
  let scoreGained = 0;
  let i = 0;

  while (i < tiles.length) {
    const current = tiles[i];
    const next = tiles[i + 1];
    if (next && next.value === current.value) {
      const mergedValue = current.value * 2;
      const mergedTile: Tile = {
        id: generateId(rng),
        value: mergedValue,
        mergedFrom: [current.id, next.id],
      };
      result.push(mergedTile);
      scoreGained += mergedValue;
      i += 2;
    } else {
      result.push(current);
      i += 1;
    }
  }

  while (result.length < line.length) {
    result.push(null);
  }

  const moved =
    result.length !== line.length ||
    result.some((cell, idx) => {
      const original = line[idx];
      if (!cell && !original) return false;
      if (!cell || !original) return true;
      return cell.id !== original.id || cell.value !== original.value;
    });

  return { line: result, moved, scoreGained };
};

export const applyMove = (
  grid: Grid,
  direction: Direction,
  rng: RNG,
): { grid: Grid; moved: boolean; scoreGained: number } => {
  const lines = getLines(grid, direction);
  const nextGrid = grid.slice();
  let moved = false;
  let scoreGained = 0;

  lines.forEach((lineIndices) => {
    const line = lineIndices.map((idx) => grid[idx]);
    const { line: collapsed, moved: lineMoved, scoreGained: gained } = slideLine(line, rng);
    scoreGained += gained;
    if (lineMoved) moved = true;
    lineIndices.forEach((idx, pos) => {
      nextGrid[idx] = collapsed[pos] || null;
    });
  });

  return { grid: nextGrid, moved, scoreGained };
};

