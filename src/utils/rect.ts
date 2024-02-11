import { valueInRange } from "./math";

/**
 * Represents a rectangle with a position and dimensions.
 */
export class Rect {
  x: number;
  y: number;
  width: number;
  height: number;
  
  /**
   * Creates a new instance of the Rect class.
   * @param x - The x-coordinate of the top-left corner of the rectangle.
   * @param y - The y-coordinate of the top-left corner of the rectangle.
   * @param width - The width of the rectangle.
   * @param height - The height of the rectangle.
   */
  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * Updates the position and dimensions of the rectangle.
   * @param x - The new x-coordinate of the top-left corner of the rectangle.
   * @param y - The new y-coordinate of the top-left corner of the rectangle.
   * @param width - The new width of the rectangle.
   * @param height - The new height of the rectangle.
   */
  update(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * Checks if this rectangle intersects with another rectangle.
   * @param rect - The other rectangle to check for intersection.
   * @returns True if the rectangles intersect, false otherwise.
   */
  intersects(rect: Rect) {
    var xOverlap = valueInRange(this.x, rect.x, rect.x + rect.width) ||
    valueInRange(rect.x, this.x, this.x + this.width);
   
    var yOverlap = valueInRange(this.y, rect.y, rect.y + rect.height) ||
    valueInRange(rect.y, this.y, this.y + this.height); 
    return xOverlap && yOverlap;
  }

}
