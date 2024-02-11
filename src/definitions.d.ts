
export type ScoreType = 'alien-kill' | 'player-kill' | 'wave-clear' | 'wave-modifier';

export type ScoreMap = {
  [key in ScoreType]: number;
}

/**
 * Represents the configuration options for an invader.
 */
export interface InvaderConfig {
  // where to get the sprite PNG from
  spriteUrl?: string; // 'https://mrfrase3.github.io/ts-invaders/sprites.png'
  // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code
  leftKeys?: string[]; // ['ArrowLeft', 'KeyA']
  rightKeys?: string[]; // ['ArrowRight', 'KeyD']
  fireKeys?: string[]; // ['Space', 'KeyW', 'ArrowUp']
  textBlinkFrequency?: number; // 750 (ms)
  playerLives?: number; // 3
  scores?: ScoreMap; // see below
  font?: string; // 'monospace'
  title?: string; // 'TS Invaders'
  startText?: string; // 'Press space to play!'
  // methods to get/set the high score from somewhere
  // defaults to local storage under 'invaders-high-score'
  getHighScore?: () => number;
  setHighScore?: (score: number) => void;
}

export type KeyType = 'left' | 'right' | 'fire';
