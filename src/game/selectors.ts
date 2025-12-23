import { BoardSize, CellIndex, Direction, Grid, Tile } from './types';

export const BOARD_SIZE: BoardSize = 4;
export const CELL_COUNT = BOARD_SIZE * BOARD_SIZE;

export const coordToIndex = (x: number, y: number): CellIndex =>
  y * BOARD_SIZE + x;

export const indexToCoord = (index: CellIndex): { x: number; y: number } => ({
  x: index % BOARD_SIZE,
  y: Math.floor(index / BOARD_SIZE),
});

export const getCell = (grid: Grid, x: number, y: number): Tile | null =>
  grid[coordToIndex(x, y)];

export const setCell = (
  grid: Grid,
  x: number,
  y: number,
  tile: Tile | null,
): Grid => {
  const idx = coordToIndex(x, y);
  const next = grid.slice();
  next[idx] = tile;
  return next;
};

export const cloneGrid = (grid: Grid): Grid => grid.slice();

export const getEmptyCells = (grid: Grid): CellIndex[] =>
  grid.reduce<CellIndex[]>((acc, cell, idx) => {
    if (cell === null) acc.push(idx);
    return acc;
  }, []);

export const hasEmptyCell = (grid: Grid): boolean => getEmptyCells(grid).length > 0;

export const getMaxTileValue = (grid: Grid): number =>
  grid.reduce((max, cell) => (cell ? Math.max(max, cell.value) : max), 0);

const traversalOrder = {
  up: { xs: [0, 1, 2, 3], ys: [0, 1, 2, 3] },
  down: { xs: [0, 1, 2, 3], ys: [3, 2, 1, 0] },
  left: { xs: [0, 1, 2, 3], ys: [0, 1, 2, 3] },
  right: { xs: [3, 2, 1, 0], ys: [0, 1, 2, 3] },
} as const;

export const getLines = (grid: Grid, direction: Direction): CellIndex[][] => {
  const lines: CellIndex[][] = [];
  const { xs, ys } = traversalOrder[direction];
  if (direction === 'left' || direction === 'right') {
    ys.forEach((y) => {
      const line = xs.map((x) => coordToIndex(x, y));
      lines.push(line);
    });
  } else {
    xs.forEach((x) => {
      const line = ys.map((y) => coordToIndex(x, y));
      lines.push(line);
    });
  }
  return lines;
};

export const canMergeNeighbors = (grid: Grid): boolean => {
  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      const current = getCell(grid, x, y);
      if (!current) continue;
      const right = x + 1 < BOARD_SIZE ? getCell(grid, x + 1, y) : null;
      const down = y + 1 < BOARD_SIZE ? getCell(grid, x, y + 1) : null;
      if ((right && right.value === current.value) || (down && down.value === current.value)) {
        return true;
      }
    }
  }
  return false;
};

export const canMove = (grid: Grid): boolean =>
  hasEmptyCell(grid) || canMergeNeighbors(grid);

