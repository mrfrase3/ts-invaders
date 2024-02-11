import type { InvaderConfig } from './definitions.d';
import { InvaderState } from './state';

export type * from './definitions.d';

/**
 * Represents the InvadersGame class.
 */
export default class InvadersGame {
  config: InvaderConfig;
  canvas: HTMLCanvasElement;
  sprites?: HTMLImageElement;
  state?: InvaderState;

  /**
   * Creates an instance of InvadersGame.
   * @param {HTMLCanvasElement} canvas - The HTML canvas element.
   * @param {InvaderConfig} [config={}] - The configuration object for the game.
   */
  constructor(canvas: HTMLCanvasElement, config: InvaderConfig = {}) {
    this.canvas = canvas;
    this.config = config;
  }

  /**
   * Loads the sprites for the game.
   * @returns {Promise<void>} A promise that resolves when the sprites are loaded.
   */
  async loadSprites(): Promise<void> {
    const spriteUrl = this.config.spriteUrl || './sprites.png';
    const sprites = new Image();
    sprites.src = spriteUrl;
    await new Promise((resolve) => {
      sprites.onload = resolve;
    });
    this.sprites = sprites;
  }

  /**
   * Starts the game.
   * @returns {Promise<void>} A promise that resolves when the game is started.
   */
  async start(): Promise<void> {
    await this.loadSprites();
    this.state = new InvaderState(this.config, this.canvas, this.sprites!, this.sprites!);
    this.state.init();
    this.state.animate();
  }

  /**
   * Destroys the game.
   */
  destroy(): void {
    this.state?.destroy();
  }
}


