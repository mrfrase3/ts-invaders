import { SheetSprite } from "./sheet-sprite";
import { clamp } from "../utils/math";

/**
 * Represents the player entity in the game.
 */
export class Player extends SheetSprite {
  lives: number = 3;
  xVel: number = 0;
  bulletDelayAccumulator: number = 0;
  score: number = 0;
  
  /**
   * Initializes the player entity.
   */
  init(): void {
    super.init();
    this.position.update(320, 570);
    this.scale.update(0.85, 0.85);
    this.lives = this.state.config.playerLives || 3;
    this.xVel = 0;
    this.bulletDelayAccumulator = 0;
    this.score = 0;
  }

  /**
   * Resets the player entity to its initial state.
   */
  reset(): void {
    this.lives = 3;
    this.score = 0;
    this.position.update(320, 570);
  }

  /**
   * Fires a bullet from the player entity.
   */
  shoot(): void {
    const bullet = this.state.bulletPool.create(this.position.x, this.position.y - this.bounds.height / 2);
    bullet.direction = 1;
    bullet.speed = 1000;
    bullet.friendly = true;
  }

  /**
   * Decreases the player's life count by 1.
   * If the player has no more lives, the game is reset.
   */
  looseLife(): void {
    this.lives -= 1;
    if (this.lives < 0) {
      this.state.reset();
    }
  }

  /**
   * Handles the player's input.
   */
  handleInput(): void {
    this.xVel = 0;
    if (this.state.isKeyDown('left')) {
      this.xVel = -250;
    } else if (this.state.isKeyDown('right')) {
      this.xVel = 250;
    }
    // wasKeyPressed is used to prevent the player from holding down the fire button
    if (this.state.wasKeyPressed('fire')) {
      if (this.bulletDelayAccumulator > 0.5) {
        this.shoot(); 
        this.bulletDelayAccumulator = 0;
      }
    }
  }

  /**
   * Updates the player entity.
   * @param dt - The time elapsed since the last update.
   */
  update(dt: number): void {
    super.update(dt);
    // update time passed between shots
    this.bulletDelayAccumulator += dt;
    
    // apply x vel
    this.position.x += this.xVel * dt;
    
    // cap player position in screen bounds
    this.position.x = clamp(this.position.x, this.bounds.width/2, 640 - this.bounds.width/2);
  }

  /**
   * Draws the player entity.
   * @param resized - Indicates whether the game window has been resized.
   */
  draw(resized: boolean): void {
    super.draw(resized);
  }
}