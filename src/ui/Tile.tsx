import classNames from 'clsx';
import styles from './Tile.module.css';

type Props = {
  value: number;
};

const valueClass = (value: number) => {
  const capped = value > 8192 ? 8192 : value;
  return styles[`v${capped as 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 | 8192}`];
};

export const Tile = ({ value }: Props) => {
  const cls = classNames(styles.tile, valueClass(value), styles.new);
  return <div className={cls}>{value}</div>;
};

