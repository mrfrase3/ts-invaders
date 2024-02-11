import type { InvaderConfig, KeyType, ScoreType, ScoreMap } from './definitions.d';
import { Player } from './entities/player';
import { Bullet } from './entities/bullet';
import { Alien } from './entities/alien';
import { Rect } from './utils/rect';
import { Point2D } from "./utils/point";
import { EntityPool } from './utils/entity-pool';
import { InvadersHUD } from './utils/hud';

const defaultScores: ScoreMap = {
  'alien-kill': 25, // when you kill an alien
  'player-kill': 0, // when an alien kills you
  'wave-clear': 500, // when you complete a wave (get rid of all visible aliens)
  'wave-modifier': 1, // increases alien-kill each wave by a multiple (kill * wave * modifier) 0 to disable
};

const defaultScoreKey = 'invaders-high-score';
const defaultGetHighScore = () => localStorage.getItem(defaultScoreKey)
  ? parseInt(localStorage.getItem(defaultScoreKey)!, 10)
  : 0;
const defaultSetHighScore = (score: number) => localStorage.setItem(defaultScoreKey, score.toString());

const IS_CHROME = /Chrome/.test(navigator.userAgent);

/**
 * Represents the state of the Invaders game.
 */
export class InvaderState {
  config: InvaderConfig;
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  canvasSize: Point2D;
  spriteSheetImg: HTMLImageElement;
  bulletImg: HTMLImageElement;
  keyStates: Record<string, boolean>;
  prevKeyStates: Record<string, boolean>;
  lastTime: number;
  destroyed: boolean = false;
  player: Player;
  bulletPool: EntityPool<Bullet>;
  topAlienPool: EntityPool<Alien>;
  middleAlienPool: EntityPool<Alien>;
  bottomAlienPool: EntityPool<Alien>;
  hud: InvadersHUD;
  // aliens: Alien[];
  // particleManager: ParticleManager;
  updateAlienLogic: boolean;
  alienDirection: number;
  stepDelay: number;
  wave: number;
  hasGameStarted: boolean;
  score: number;
  highScore: number = 0;

  CANVAS_WIDTH = 640;
  CANVAS_HEIGHT = 640;
  PLAYER_CLIP_RECT = new Rect(0, 204, 62, 32);
  ALIEN_BOTTOM_ROW = [ new Rect(0, 0, 51, 34), new Rect(0, 102, 51, 34) ];
  ALIEN_MIDDLE_ROW = [ new Rect(0, 137, 50, 33), new Rect(0, 170, 50, 34) ];
  ALIEN_TOP_ROW = [ new Rect(0, 68, 50, 32), new Rect(0, 34, 50, 32) ];
  BULLET_CLIP_RECT = new Rect(63, 0, 2, 8);
  ALIEN_X_MARGIN = 40;
  ALIEN_SQUAD_WIDTH = 11 * this.ALIEN_X_MARGIN;

  keyDownHandler: null | ((e: KeyboardEvent) => void) = null;
  keyUpHandler: null | ((e: KeyboardEvent) => void) = null;

  constructor(
    config: InvaderConfig,
    canvas: HTMLCanvasElement,
    spriteSheetImg: HTMLImageElement,
    bulletImg: HTMLImageElement,
  ) {
    this.config = config;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.imageSmoothingEnabled = false;
    this.canvas = canvas;
    this.canvasSize = new Point2D(0, 0);
    this.spriteSheetImg = spriteSheetImg;
    this.bulletImg = bulletImg;
    this.keyStates = {};
    this.prevKeyStates = {};
    this.lastTime = 0;
    this.player = new Player(this, this.spriteSheetImg, this.PLAYER_CLIP_RECT, 0, 0);
    this.bulletPool = new EntityPool((x, y) => new Bullet(this, this.spriteSheetImg, this.BULLET_CLIP_RECT, x, y));
    this.topAlienPool = new EntityPool((x, y) => new Alien(this, this.spriteSheetImg, this.ALIEN_TOP_ROW, x, y));
    this.middleAlienPool = new EntityPool((x, y) => new Alien(this, this.spriteSheetImg, this.ALIEN_MIDDLE_ROW, x, y));
    this.bottomAlienPool = new EntityPool((x, y) => new Alien(this, this.spriteSheetImg, this.ALIEN_BOTTOM_ROW, x, y));
    this.hud = new InvadersHUD(this);
    // this.particleManager = new ParticleManager();
    this.updateAlienLogic = false;
    this.alienDirection = -1;
    this.stepDelay = 1;
    this.wave = 1;
    this.score = 0;
    this.highScore = config.getHighScore ? config.getHighScore() : defaultGetHighScore();
    this.hasGameStarted = false;
    this.keyDownHandler = (e: KeyboardEvent) => {
      this.keyStates[e.code] = true;
    };
    this.keyUpHandler = (e: KeyboardEvent) => {
      this.keyStates[e.code] = false;
    };
    window.addEventListener('keydown', this.keyDownHandler);
    window.addEventListener('keyup', this.keyUpHandler);
  }

  /**
   * Gets the total count of alive aliens in the game state.
   * @returns The count of alive aliens.
   */
  get alienCount() {
    return this.topAlienPool.aliveCount
      + this.middleAlienPool.aliveCount
      + this.bottomAlienPool.aliveCount;
  }

  /**
   * Returns an array of all alive alien entities.
   * 
   * @returns {Alien[]} The array of alive alien entities.
   */
  get aliens() {
    return [
      ...this.topAlienPool.aliveEntities,
      ...this.middleAlienPool.aliveEntities,
      ...this.bottomAlienPool.aliveEntities,
    ];
  }

  /**
   * Initializes the game state.
   */
  init() {
    this.score = 0;
    this.updateAlienLogic = false;
    this.alienDirection = -1;
    this.stepDelay = 1;
    this.wave = 1;
    this.hasGameStarted = false;
    this.player.init();
    this.setupAlienFormation();
    this.hud.init();
  }

  /**
   * Sets up the alien formation by creating aliens in a grid pattern.
   */
  setupAlienFormation() {
    for (let i = 0, len = 5 * 11; i < len; i += 1) {
      const gridX = (i % 11);
      const gridY = Math.floor(i / 11);
      let pool: EntityPool<Alien>;
      switch (gridY) {
        case 0: 
        case 1: 
          pool = this.bottomAlienPool;
          break;
        case 2: 
        case 3:
          pool = this.middleAlienPool;
          break;
        default:
          pool = this.topAlienPool;
          break;
      }
      const x = (this.CANVAS_WIDTH/2 - this.ALIEN_SQUAD_WIDTH/2) + this.ALIEN_X_MARGIN/2 + gridX * this.ALIEN_X_MARGIN;
      const y = this.CANVAS_HEIGHT/3 - gridY * 40;
      pool.create(x, y);
    }
  }

  /**
   * Updates the alien formation.
   * If there are no more aliens remaining, it increments the wave,
   * resets the alien logic, changes the alien direction, sets up a new alien formation,
   * and updates the score.
   * Calculates the step delay based on the number of aliens and the current wave.
   * If the updateAlienLogic flag is set, it changes the alien direction and updates the alien positions.
   */
  updateAlienFormation() {
    if (!this.alienCount) {
      this.wave += 1;
      this.updateAlienLogic = false;
      this.alienDirection = -1;
      this.setupAlienFormation();
      this.updateScore('wave-clear');
    }
    let stepDelay = ((this.alienCount * 20) - (this.wave * 10)) / 1000;
    stepDelay = Math.max(stepDelay, 0.1);
    this.stepDelay = stepDelay;
    if (this.updateAlienLogic) {
      this.alienDirection *= -1;
      this.aliens.forEach((alien) => {
        alien.position.y += 25;
      });
      this.updateAlienLogic = false;
    }
  }

  /**
   * Updates the score based on the given score type.
   * @param type The type of score to update.
   */
  updateScore(type: ScoreType) {
    const waveModifier = this.config.scores?.['wave-modifier'] || defaultScores['wave-modifier'];
    const modifier = this.wave * waveModifier || 1;
    let score = this.config.scores?.[type] || defaultScores[type];
    if (type === 'alien-kill') {
      score *= modifier;
    }
    this.score += score;
  }

  /**
   * Destroys the game state by removing the canvas, sprite sheet image, bullet image,
   * and event listeners. Sets the 'destroyed' flag to true.
   */
  destroy() {
    this.canvas.remove();
    this.spriteSheetImg.remove();
    this.bulletImg.remove();
    if (this.keyDownHandler && this.keyUpHandler) {
      window.removeEventListener('keydown', this.keyDownHandler);
      window.removeEventListener('keyup', this.keyUpHandler);
    }
    this.destroyed = true;
  }

  /**
   * Resets the game state by purging alien pools and bullet pool,
   * updating the high score if necessary, and initializing the game.
   */
  reset() {
    this.topAlienPool.purge();
    this.middleAlienPool.purge();
    this.bottomAlienPool.purge();
    this.bulletPool.purge();
    if (this.score > this.highScore) {
      this.highScore = this.score;
      if (this.config.setHighScore) {
        this.config.setHighScore(this.score);
      } else {
        defaultSetHighScore(this.score);
      }
    }
    this.init();
  }

  /**
   * Retrieves the key codes associated with the specified type.
   * @param type - The type of key codes to retrieve ('left', 'right', or 'fire').
   * @returns An array of key codes.
   */
  getKeyCodes(type: KeyType) {
    switch (type) {
      case 'left':
        return this.config.leftKeys || ['ArrowLeft', 'KeyA'];
      case 'right':
        return this.config.rightKeys || ['ArrowRight', 'KeyD'];
      case 'fire':
        return this.config.fireKeys || ['Space', 'KeyW', 'ArrowUp'];
      default:
        return [];
    }
  }

  /**
   * Checks if a specific key type is currently being pressed down.
   * @param type - The type of the key to check.
   * @returns True if the key is being pressed down, false otherwise.
   */
  isKeyDown(type: KeyType) {
    return this.getKeyCodes(type).some((code) => this.keyStates[code]);
  }

  /**
   * Checks if a specific key was pressed.
   * @param type - The type of the key.
   * @returns A boolean indicating whether the key was pressed.
   */
  wasKeyPressed(type: KeyType) {
    return this.getKeyCodes(type).some((code) => !this.keyStates[code] && this.prevKeyStates[code]);
  }

  /**
   * Updates the game state.
   * @param dt - The time elapsed since the last update in milliseconds.
   */
  update(dt: number) {
    this.hud.update(dt);
    if (!this.hasGameStarted) {
      if (this.wasKeyPressed('fire')) {
        this.hasGameStarted = true;
      }
    } else {
      this.updateAlienFormation();
      this.player.handleInput();
    }
    this.prevKeyStates = { ...this.keyStates };
    if (this.hasGameStarted) {
      this.player.update(dt);
      this.topAlienPool.update(dt);
      this.middleAlienPool.update(dt);
      this.bottomAlienPool.update(dt);
      this.bulletPool.update(dt);
    }
  }

  /**
   * Draws the game state on the canvas.
   * @param resized - Indicates whether the canvas has been resized.
   */
  draw(resized: boolean) {
    this.ctx.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
    if (this.hasGameStarted) {
      this.topAlienPool.draw(resized);
      this.middleAlienPool.draw(resized);
      this.bottomAlienPool.draw(resized);
      this.player.draw(resized);
      this.bulletPool.draw(resized);
    }
    this.hud.draw(resized);
  }

  /**
   * Resizes the canvas based on the current client width and height.
   * @returns {boolean} - Returns true if the canvas size was updated, false otherwise.
   */
  resize() {
    const cw = this.canvas.clientWidth;
    const ch = this.canvas.clientHeight;
    if (this.canvasSize.x !== cw || this.canvasSize.y !== ch) {
      this.canvasSize.update(this.canvas.clientWidth, this.canvas.clientHeight);
      const scaleFactor = Math.min(cw / this.CANVAS_WIDTH, ch / this.CANVAS_HEIGHT);
      if (IS_CHROME) {
        this.canvas.width = this.CANVAS_WIDTH * scaleFactor;
        this.canvas.height = this.CANVAS_HEIGHT * scaleFactor;
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.transform(scaleFactor, 0, 0, scaleFactor, 0, 0);
      } else {
        this.canvas.style.width = this.CANVAS_WIDTH * scaleFactor + 'px';
        this.canvas.style.height = this.CANVAS_HEIGHT * scaleFactor + 'px';
      }
      return true;
    }
    return false;
  }

  /**
   * The main game loop.
   */
  animate() {
    if (this.destroyed) {
      return;
    }
    const resized = this.resize();
    const now = performance.now();
    const dt = (now - this.lastTime) / 1000;
    this.update(dt);
    this.draw(resized);
    this.lastTime = now;
    requestAnimationFrame(() => this.animate());
  }
}