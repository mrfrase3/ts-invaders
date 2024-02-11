import { SheetSprite } from './sheet-sprite';

/**
 * Represents a bullet entity in the game.
 */
export class Bullet extends SheetSprite {
  direction: number = 1;
  speed: number = 1000;
  friendly: boolean = false;

  /**
   * Initializes the bullet entity.
   */
  init(): void {
    super.init();
    this.direction = 1;
    this.speed = 1000;
    this.friendly = false;
  }

  /**
   * Performs hit detection for the bullet entity.
   */
  hitDetect() {
    // if the bullet is not friendly, check if it intersects with the player
    if (!this.friendly) {
      if (this.intersects(this.state.player)) {
        this.state.player.looseLife();
        this.state.updateScore('player-kill');
        this.recycle();
      }
    } else {
      // if the bullet is friendly, check if it intersects with any of the aliens
      this.state.aliens.forEach(alien => {
        if (alien.alive && this.intersects(alien)) {
          alien.recycle();
          this.recycle();
          this.state.updateScore('alien-kill');
        }
      });
    }
  }

  /**
   * Updates the bullet entity.
   * @param dt - The time delta since the last update.
   */
  update(dt: number): void {
    super.update(dt);
    this.position.y -= (this.speed * this.direction) * dt;
    
    if (this.position.y < 0 || this.position.y > this.state.CANVAS_HEIGHT) {
      this.recycle();
    } else {
      this.hitDetect();
    }
  }
}