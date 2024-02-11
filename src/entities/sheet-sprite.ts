import { BaseSprite } from "./base-sprite";
import { Rect } from "../utils/rect";
import type { InvaderState } from '../state';

/**
 * Represents a sprite that uses a sprite sheet for animation.
 * can accept multiple frames and change between them.
 */
export class SheetSprite extends BaseSprite {
  clipRect: Rect;
  frames: Rect[];

  /**
   * Creates a new instance of SheetSprite.
   * @param state The state of the invader.
   * @param img The image element containing the sprite sheet.
   * @param frames The frames of the sprite sheet.
   * @param x The x-coordinate of the sprite's initial position.
   * @param y The y-coordinate of the sprite's initial position.
   */
  constructor(state: InvaderState, img: HTMLImageElement, frames: Rect | Rect[], x: number, y: number) {
    super(state, img, x, y);
    this.frames = Array.isArray(frames) ? frames : [frames];
    this.clipRect = this.frames[0];
    this.bounds.update(x, y, this.clipRect.width, this.clipRect.height);
  }

  /**
   * Initializes the sprite.
   */
  init() {
    super.init();
    this.clipRect = this.frames[0];
  }

  /**
   * Sets the current frame of the sprite.
   * @param frame The index of the frame to set.
   */
  setFrame(frame: number) {
    this.clipRect = this.frames[frame];
  }

  /**
   * Moves to the next frame of the sprite.
   */
  nextFrame() {
    const index = this.frames.indexOf(this.clipRect);
    const nextIndex = (index + 1) % this.frames.length;
    this.clipRect = this.frames[nextIndex];
  }

  /**
   * Updates the bounds of the sprite.
   * @private
   */
  _updateBounds() {
    var w = ~~(0.5 + this.clipRect.width * this.scale.x);
    var h = ~~(0.5 + this.clipRect.height * this.scale.y);
    this.bounds.update(this.position.x - w / 2, this.position.y - h / 2, w, h);
  }

  /**
   * Draws the sprite on the canvas.
   * @private
   */
  _drawImage() {
    const { ctx } = this.state as InvaderState;
    ctx.save();
    ctx.transform(this.scale.x, 0, 0, this.scale.y, this.position.x, this.position.y);
    ctx.drawImage(
      this.img,
      this.clipRect.x,
      this.clipRect.y,
      this.clipRect.width,
      this.clipRect.height,
      ~~(0.5 + -this.clipRect.width * 0.5),
      ~~(0.5 + -this.clipRect.height * 0.5),
      this.clipRect.width,
      this.clipRect.height
    );
    ctx.restore();
  }

  /**
   * Draws the sprite on the canvas.
   * @param resized Indicates whether the canvas has been resized.
   */
  draw(resized: boolean) {
    this._updateBounds();
    this._drawImage();
  }
}