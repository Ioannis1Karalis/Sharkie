/**
 * Base class for all drawable game objects.
 * Holds a current image, a cache of preloaded images, and basic
 * position/size properties used by the renderer.
 *
 * Note: Class name is intentionally kept as "DrawbleObject" to match existing code.
 *
 * @property {HTMLImageElement|undefined} img         - Currently displayed image.
 * @property {Record<string, HTMLImageElement>} imageCache - Map of path → preloaded image.
 * @property {number} currentImage                    - Frame index for animations.
 * @property {number} x                               - X position in world space.
 * @property {number} y                               - Y position in world space.
 * @property {number} height                          - Render height in pixels.
 * @property {number} width                           - Render width in pixels.
 */
class DrawbleObject {
  img;
  imageCache = {};
  currentImage = 0;
  x = 120;
  y = 120;
  height = 150;
  width = 100;

  /**
   * Load a single image and assign it as the current sprite.
   * @param {string} path - URL/path to the image file.
   * @returns {void}
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Draw the current image onto the given 2D canvas context.
   * Safely returns if no image is loaded yet.
   * @param {CanvasRenderingContext2D} ctx - 2D rendering context.
   * @returns {void}
   */
  draw(ctx) {
    if (!(this.img instanceof Image)) return;
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Preload and cache multiple images for quick access/animation.
   * Cached images are stored using their path as the key.
   * @param {string[]} arr - List of image URLs/paths to load.
   * @returns {void}
   */
  loadImages(arr) {
    arr.forEach((path) => {
      const img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}