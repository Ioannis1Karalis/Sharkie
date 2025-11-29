/**
 * Static barrier element that extends {@link MovableObject}.
 * Typically used to block player or enemies at a fixed position.
 * Dimensions default to 780×520 at world position (1000, 0).
 */
class Barrier extends MovableObject {
  /** Width in pixels. @type {number} */
  width = 780;

  /** Height in pixels. @type {number} */
  height = 520;

  /** World x-position (left). @type {number} */
  x = 1000;

  /** World y-position (top). @type {number} */
  y = 0;

  /**
   * Image list for the barrier sprite (first entry is used).
   * @type {string[]}
   */
  IMAGES = ["img/4.Background/Barrier/1.png"];

  /**
   * Create the barrier and load its sprite.
   * Uses the image list defined in {@link Barrier#IMAGES}.
   */
  constructor() {
    super().loadImage(this.IMAGES);
  }
}