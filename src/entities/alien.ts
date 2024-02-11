import { SheetSprite } from './sheet-sprite';
import { Bullet } from './bullet';

/**
 * Represents an Alien entity in the game.
 */
export class Alien extends SheetSprite {
  onFirstState: boolean = true;
  stepAccumulator: number = 0;
  bullet: Bullet | null = null;

  /**
   * Initializes the Alien entity.
   */
  init(): void {
    super.init();
    this.scale.update(0.5, 0.5);
    this.onFirstState = true;
    this.stepAccumulator = 0;
    this.bullet = null;
  }

  /**
   * Makes the Alien entity shoot a bullet.
   */
  shoot(): void {
    const bullet = this.state.bulletPool.create(this.position.x, this.position.y - this.bounds.width / 2);
    bullet.direction = -1;
    bullet.speed = 500;
    this.bullet = bullet;
  }

  /**
   * Updates the Alien entity.
   * @param dt - The time elapsed since the last update.
   */
  update(dt: number): void {
    super.update(dt);
    this.stepAccumulator += dt;
    // clean up the bullet if it's no longer alive
    if (this.bullet?.alive === false) {
      this.bullet = null;
    }
    const { alienDirection, stepDelay, CANVAS_WIDTH } = this.state;
    // aliens only perform an action in stepDelay intervals
    if (this.stepAccumulator >= stepDelay) {
      // if the alien is exceeding the bounds of the canvas, we tell the state to update the alien logic
      // i.e. change the direction and move down (this needs to be done across all aliens, not just this one)
      if (this.position.x < this.bounds.width / 2 + 20 && alienDirection < 0) {
        this.state.updateAlienLogic = true;
      } if (alienDirection === 1 && this.position.x > CANVAS_WIDTH - this.bounds.width / 2 - 20) {
        this.state.updateAlienLogic = true;
      }
      // if the alien reaches the bottom of the canvas, the game is reset
      if (this.position.y > CANVAS_WIDTH - 50) {
        this.state.reset();
      }
      
      // .5% chance to shoot a bullet
      if (Math.random() * 1000 <= 5 * (stepDelay + 1) && !this.bullet?.alive) {
        this.shoot();
      }
      this.position.x += 10 * alienDirection;
      // change the alien's sprite to the next frame
      this.nextFrame();
      this.stepAccumulator = 0;
    }
  }
}
