import { Point2D } from '../utils/point';
import { Rect } from '../utils/rect';
import type { InvaderState } from '../state';
import type { EntityPool } from '../utils/entity-pool';

/**
 * Represents a base sprite in the game.
 */
export class BaseSprite {
  state: InvaderState;
  img: HTMLImageElement;
  position: Point2D;
  scale: Point2D;
  bounds: Rect;
  doLogic: boolean;
  alive: boolean;
  pool?: EntityPool<BaseSprite>;

  /**
   * Creates a new instance of the BaseSprite class.
   * @param state The state of the invader.
   * @param img The image element representing the sprite.
   * @param x The x-coordinate of the sprite's initial position.
   * @param y The y-coordinate of the sprite's initial position.
   */
  constructor(state: InvaderState, img: HTMLImageElement, x: number, y: number) {
    this.state = state;
    this.img = img;
    this.position = new Point2D(x, y);
    this.scale = new Point2D(1, 1);
    this.bounds = new Rect(x, y, this.img.width, this.img.height);
    this.doLogic = true;
    this.alive = true;
  }

  /**
   * Registers the sprite with an entity pool.
   * @param pool The entity pool to register with.
   */
  registerPool(pool: EntityPool<BaseSprite>) {
    this.pool = pool;
  }

  /**
   * Recycles the sprite, making it available for reuse.
   */
  recycle() {
    this.alive = false;
    if (this.pool) {
      this.pool.recycle(this);
    }
  }

  /**
   * Checks if the sprite intersects with another sprite.
   * @param other The other sprite to check against.
   * @returns True if the sprites intersect, false otherwise.
   */
  intersects(other: BaseSprite) {
    return this.bounds.intersects(other.bounds);
  }

  /**
   * Initializes the sprite.
   */
  init() {
    this.alive = true;
    this._updateBounds();
  }

  /**
   * Updates the sprite.
   * @param dt The time elapsed since the last update.
   */
  update(dt: number) { }

  /**
   * Updates the bounds of the sprite.
   * @private
   */
  _updateBounds() {
    this.bounds.update(this.position.x, this.position.y, ~~(0.5 + this.img.width * this.scale.x), ~~(0.5 + this.img.height * this.scale.y));
  }

  /**
   * Draws the sprite.
   * @param resized Indicates whether the canvas has been resized.
   */
  draw(resized: boolean) {
    this._updateBounds();
    this._drawImage();
  }

  /**
   * Draws the image of the sprite on the canvas.
   * @private
   */
  _drawImage() {
    this.state.ctx.drawImage(this.img, this.position.x, this.position.y);
  }
}
