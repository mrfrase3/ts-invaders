
export type ScoreType = 'alien-kill' | 'player-kill' | 'wave-clear' | 'wave-modifier';

export type ScoreMap = {
  [key in ScoreType]: number;
}

/**
 * Represents the configuration options for an invader.
 */
export interface InvaderConfig {
  spriteUrl?: string;
  leftKeys?: string[];
  rightKeys?: string[];
  fireKeys?: string[];
  textBlinkFrequency?: number;
  playerLives?: number;
  scores?: ScoreMap;
  font?: string;
  title?: string;
  startText?: string;
  getHighScore?: () => number;
  setHighScore?: (score: number) => void;
}

export type KeyType = 'left' | 'right' | 'fire';
