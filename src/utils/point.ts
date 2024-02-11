
/**
 * Represents a 2D point with x and y coordinates.
 */
export class Point2D {
  x: number;
  y: number;

  /**
   * Creates a new Point2D object.
   * @param x - The x-coordinate of the point.
   * @param y - The y-coordinate of the point.
   */
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Updates the coordinates of the point.
   * @param x - The new x-coordinate of the point.
   * @param y - The new y-coordinate of the point.
   */
  update(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
