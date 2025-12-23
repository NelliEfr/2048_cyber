import styles from './ScorePanel.module.css';

type Props = {
  score: number;
  bestScore: number;
};

export const ScorePanel = ({ score, bestScore }: Props) => (
  <div className={styles.panel}>
    <div className={styles.box}>
      <span className={styles.label}>Score</span>
      <span className={styles.value}>{score}</span>
    </div>
    <div className={styles.box}>
      <span className={styles.label}>Best</span>
      <span className={styles.value}>{bestScore}</span>
    </div>
  </div>
);

