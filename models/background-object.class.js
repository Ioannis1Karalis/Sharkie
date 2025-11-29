/**
 * Background tile that scrolls with the world camera.
 * Extends {@link MovableObject} but is typically non-interactive.
 * The default size matches the canvas (880×520).
 */
class BackgroundObject extends MovableObject {
  /** Width in pixels. @type {number} */
  width = 880;

  /** Height in pixels. @type {number} */
  height = 520;

  /**
   * Create a background object at the given world coordinates.
   * @param {string} imagePath - Path to the background image asset.
   * @param {number} x - World x-position (left).
   * @param {number} y - World y-position (top).
   */
  constructor(imagePath, x, y) {
    super().loadImage(imagePath);
    /** @type {number} */ this.x = x;
    /** @type {number} */ this.y = y;
  }
}