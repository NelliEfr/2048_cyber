import { Grid } from '../game/types';
import { indexToCoord } from '../game/selectors';
import styles from './Board.module.css';
import { Tile } from './Tile';

type Props = {
  grid: Grid;
};

export const Board = ({ grid }: Props) => (
  <div className={styles.board}>
    {Array.from({ length: 16 }).map((_, idx) => (
      <div key={`cell-${idx}`} className={styles.cell} />
    ))}
    <div className={styles.tiles}>
      {grid.map((tile, idx) => {
        if (!tile) return null;
        const { x, y } = indexToCoord(idx);
        return (
          <div
            key={tile.id}
            style={{ gridColumnStart: x + 1, gridRowStart: y + 1 }}
          >
            <Tile value={tile.value} />
          </div>
        );
      })}
    </div>
  </div>
);

