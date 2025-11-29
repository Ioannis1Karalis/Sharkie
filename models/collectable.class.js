/**
 * Collectible item (coin or poison) that can be static or animated.
 * Pass a single sprite path for a static item, or an array of frame paths
 * to create a looping animation.
 *
 * @extends MovableObject
 * @property {number} width  - Render width in pixels (default 40).
 * @property {number} height - Render height in pixels (default 40).
 * @property {string[]|null} frames - Animation frames (if animated).
 * @property {number|null} animTimer - Interval id for the animation loop.
 * @property {number} animSpeed - Frame interval in ms (default 180).
 * @property {"coin"|"poison"} kind - Item type, affects pickup logic/UX.
 */
class Collectable extends MovableObject {
  width = 40;
  height = 40;

  frames = null;
  animTimer = null;
  animSpeed = 180;
  kind = "coin";

  /**
   * @param {number} x - World x-coordinate.
   * @param {number} y - World y-coordinate.
   * @param {string|string[]} spriteOrFrames - Single sprite path or an array of frame paths.
   */
  constructor(x, y, spriteOrFrames) {
    super();
    this.x = x;
    this.y = y;

    if (Array.isArray(spriteOrFrames)) {
      this.frames = spriteOrFrames;
      this.loadImages(this.frames);
      this.currentImage = 0;
      this.img = this.imageCache[this.frames[0]];
      this.startAnim();
    } else {
      this.loadImage(spriteOrFrames);
    }
  }

  /**
   * Starts the frame loop for animated collectibles.
   * No-op when there are no frames.
   */
  startAnim() {
    if (!this.frames || !this.frames.length) return;
    if (this.animTimer) clearInterval(this.animTimer);
    this.animTimer = setInterval(
      () => this.playAnimation(this.frames),
      this.animSpeed
    );
  }

  /**
   * Stops the animation and clears the interval.
   */
  stopAnim() {
    if (this.animTimer) {
      clearInterval(this.animTimer);
      this.animTimer = null;
    }
  }

  /**
   * Factory: animated coin collectible.
   * @param {number} x - World x-coordinate.
   * @param {number} y - World y-coordinate.
   * @returns {Collectable} Configured coin instance.
   */
  static coin(x, y) {
    const c = new Collectable(x, y, [
      "img/5.Marcadores/1. Coins/1.png",
      "img/5.Marcadores/1. Coins/2.png",
      "img/5.Marcadores/1. Coins/3.png",
      "img/5.Marcadores/1. Coins/4.png",
    ]);
    c.kind = "coin";
    return c;
  }

  /**
   * Factory: poison bottle facing left.
   * @param {number} x - World x-coordinate.
   * @param {number} y - World y-coordinate.
   * @returns {Collectable} Configured poison instance.
   */
  static poisonLeft(x, y) {
    const poisonL = new Collectable(
      x,
      y,
      "img/5.Marcadores/Poison/DarkLeft.png"
    );
    poisonL.width = 70;
    poisonL.height = 90;
    poisonL.kind = "poison";
    return poisonL;
  }

  /**
   * Factory: poison bottle facing right.
   * @param {number} x - World x-coordinate.
   * @param {number} y - World y-coordinate.
   * @returns {Collectable} Configured poison instance.
   */
  static poisonRight(x, y) {
    const poisonR = new Collectable(
      x,
      y,
      "img/5.Marcadores/Poison/DarkRight.png"
    );
    poisonR.width = 70;
    poisonR.height = 90;
    poisonR.kind = "poison";
    return poisonR;
  }
}