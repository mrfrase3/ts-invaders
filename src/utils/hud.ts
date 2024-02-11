import type { InvaderState } from "../state";

/**
 * Represents the Heads-Up Display (HUD) for the Invaders game.
 */
export class InvadersHUD {
  state: InvaderState;
  font: string;
  showBlink: boolean = true;
  blinkAccumulator: number = 0;

  /**
   * Creates an instance of InvadersHUD.
   * @param state - The InvaderState object.
   */
  constructor(state: InvaderState) {
    this.state = state;
    this.font = this.state.config.font
      ? `${this.state.config.font},monospace`
      : 'monospace';
    this.init();
  }

  /**
   * Initializes the HUD.
   */
  init() { }

  /**
   * Draws text on the canvas.
   * @param text - The text to be drawn.
   * @param x - The x-coordinate of the text.
   * @param y - The y-coordinate of the text.
   * @param color - The color of the text. Default is 'white'.
   * @param fontSize - The font size of the text. Default is 24.
   */
  drawText(text: string, x: number, y: number, color?: string, fontSize?: number) {
    this.state.ctx.fillStyle = color || 'white';
    this.state.ctx.font = `${fontSize || 24}px ${this.font}`;
    this.state.ctx.fillText(text, x, y);
  }

  /**
   * Draws centered text on the canvas.
   * @param text - The text to be drawn.
   * @param x - The x-coordinate of the center of the text.
   * @param y - The y-coordinate of the text.
   * @param color - The color of the text. Default is 'white'.
   * @param fontSize - The font size of the text. Default is 24.
   */
  fillCenteredText(text: string, x: number, y: number, color?: string, fontSize?: number) {
    this.state.ctx.font = `${fontSize || 24}px ${this.font}`;
    const width = this.state.ctx.measureText(text).width;
    this.drawText(text, x - (width / 2), y, color, fontSize);
  }

  /**
   * Draws blinking text on the canvas.
   * @param text - The text to be drawn.
   * @param x - The x-coordinate of the center of the text.
   * @param y - The y-coordinate of the text.
   * @param color - The color of the text. Default is 'white'.
   * @param fontSize - The font size of the text. Default is 24.
   */
  fillBlinkingText(text: string, x: number, y: number, color?: string, fontSize?: number) {
    if (this.showBlink) {
      this.fillCenteredText(text, x, y, color, fontSize);
    }
  }

  /**
   * Draws the player sprite on the canvas.
   * @param x - The x-coordinate of the top-left corner of the sprite.
   * @param y - The y-coordinate of the top-left corner of the sprite.
   * @param scale - The scale of the sprite. Default is 1.
   */
  drawPlayerSprite(x: number, y: number, scale: number) {
    const clipRect = this.state.player.clipRect;
    const img = this.state.spriteSheetImg;
    this.state.ctx.drawImage(
      img,
      clipRect.x,
      clipRect.y,
      clipRect.width,
      clipRect.height,
      x,
      y,
      clipRect.width * scale,
      clipRect.height * scale
    );
  }

  /**
   * Draws the bottom HUD on the canvas.
   */
  drawBottomHUD() {
    const { CANVAS_HEIGHT, CANVAS_WIDTH } = this.state;
    this.fillCenteredText('SCORE: ' + this.state.score, CANVAS_WIDTH / 2, 20);
    this.fillCenteredText('HIGH SCORE: ' + this.state.highScore, CANVAS_WIDTH / 2, 40, 'white', 16);
    this.state.ctx.fillStyle = '#02ff12';
    this.state.ctx.fillRect(0, CANVAS_HEIGHT - 30, CANVAS_WIDTH, 2);
    this.drawText(this.state.player.lives + ' x ', 10, CANVAS_HEIGHT - 7.5, 'white', 20);
    this.drawPlayerSprite(45, CANVAS_HEIGHT - 23, 0.5);
    this.drawText('CREDIT: ', CANVAS_WIDTH - 115, CANVAS_HEIGHT - 7.5, 'white', 20);
    this.fillBlinkingText('00', CANVAS_WIDTH - 25, CANVAS_HEIGHT - 7.5, 'white', 20);
  }

  /**
   * Draws the start screen on the canvas.
   */
  drawStartScreen() {
    const { CANVAS_HEIGHT, CANVAS_WIDTH } = this.state;
    const {
      title = 'TS Invaders',
      startText = 'Press space to play!',
    } = this.state.config;
    this.fillCenteredText(title, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2.75, '#FFFFFF', 36);
    if (startText) this.fillBlinkingText(startText, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, '#FFFFFF', 24);
    const { highScore = 0 } = this.state;
    if (highScore) this.fillCenteredText('HIGH SCORE: ' + highScore, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 1.75, '#FFFFFF', 16);
  }

  /**
   * Updates the HUD.
   * @param dt - The time difference since the last update.
   */
  update(dt: number) {
    const { textBlinkFrequency = 750 } = this.state.config;
    this.blinkAccumulator += dt;
    if (this.blinkAccumulator  > (textBlinkFrequency / 1000)) {
      this.showBlink = !this.showBlink;
      this.blinkAccumulator = 0;
    }
  }

  /**
   * Draws the HUD on the canvas.
   * @param resized - Indicates whether the canvas has been resized.
   */
  draw(resized: boolean) {
    if (this.state.hasGameStarted) {
      this.drawBottomHUD();
    } else {
      this.drawStartScreen();
    }
  }
}
