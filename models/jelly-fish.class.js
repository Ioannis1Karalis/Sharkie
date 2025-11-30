/**
 * Electrified jellyfish enemy that oscillates vertically and alternates
 * between harmless (purple) and dangerous (green) states. Uses sprite looping
 * for swim/danger animations and, when killed, plays a death sequence and
 * floats upward before being flagged for removal.
 *
 * @extends MovableObject
 * @property {number} height - Rendered height in px.
 * @property {number} width  - Rendered width in px.
 * @property {string[]} IMAGES_SWIMMING  - Swim animation frames.
 * @property {string[]} IMAGES_DANGEROUS - Dangerous-state frames.
 * @property {string[]} IMAGES_DEAD_LILA - Death frames (harmless).
 * @property {string[]} IMAGES_DEAD_GREEN - Death frames (dangerous).
 * @property {number} startY - Baseline Y used for vertical oscillation.
 * @property {number} amplitude - Oscillation amplitude in px.
 * @property {number} speed - Oscillation speed factor (ms-based).
 * @property {number} phaseOffset - Phase shift to desynchronize instances.
 * @property {{top:number,left:number,right:number,bottom:number}} offset - Hitbox padding.
 * @property {boolean} isDangerous - Whether contact hurts the player.
 * @property {boolean} isDead - Whether the enemy is dead.
 * @property {boolean} markForRemoval - Set after death float completes.
 * @property {?number} _moveTimer - Interval id for movement loop.
 * @property {?number} _animTimer - Interval id for animation loop.
 */
class JellyFish extends MovableObject {
  height = 90;
  width = 100;

  IMAGES_SWIMMING = [
    "img/3.Enemy/2 Jelly fish/Regular damage/Lila 1.png",
    "img/3.Enemy/2 Jelly fish/Regular damage/Lila 2.png",
    "img/3.Enemy/2 Jelly fish/Regular damage/Lila 3.png",
    "img/3.Enemy/2 Jelly fish/Regular damage/Lila 4.png",
  ];

  IMAGES_DANGEROUS = [
    "img/3.Enemy/2 Jelly fish/Super dangerous/Green 1.png",
    "img/3.Enemy/2 Jelly fish/Super dangerous/Green 2.png",
    "img/3.Enemy/2 Jelly fish/Super dangerous/Green 3.png",
    "img/3.Enemy/2 Jelly fish/Super dangerous/Green 4.png",
  ];

  IMAGES_DEAD_LILA = [
    "img/3.Enemy/2 Jelly fish/Dead/Lila/L1.png",
    "img/3.Enemy/2 Jelly fish/Dead/Lila/L2.png",
    "img/3.Enemy/2 Jelly fish/Dead/Lila/L3.png",
    "img/3.Enemy/2 Jelly fish/Dead/Lila/L4.png",
  ];

  IMAGES_DEAD_GREEN = [
    "img/3.Enemy/2 Jelly fish/Dead/green/g1.png",
    "img/3.Enemy/2 Jelly fish/Dead/green/g2.png",
    "img/3.Enemy/2 Jelly fish/Dead/green/g3.png",
    "img/3.Enemy/2 Jelly fish/Dead/green/g4.png",
  ];

  /**
   * Create a jellyfish at the given position and start its behavior loops.
   * @param {number} [x=850] - Initial X position.
   * @param {number} [y=200] - Initial Y position.
   */
  constructor(x, y) {
    super().loadImage(this.IMAGES_SWIMMING[0]);
    this.loadImages(this.IMAGES_SWIMMING);
    this.loadImages(this.IMAGES_DANGEROUS);
    this.loadImages(this.IMAGES_DEAD_LILA);
    this.loadImages(this.IMAGES_DEAD_GREEN);

    this.x = x || 850;
    this.y = y || 200;

    this.startY = this.y;
    this.amplitude = 155;
    this.speed = 0.001;
    this.phaseOffset = Math.random() * Math.PI * 2;

    this.offset = { top: 5, left: 5, right: 5, bottom: 5 };

    this.isDangerous = false;
    this.isDead = false;
    this.markForRemoval = false;

    this._moveTimer = null;
    this._animTimer = null;

    this.animate();
  }

  /**
   * Start oscillation, animation, and periodic danger toggling loops.
   * No-op once dead.
   * @returns {void}
   */
  animate() {
    this._moveTimer = setInterval(() => {
      if (this.isDead) return;
      const t = Date.now();
      this.y =
        this.startY +
        Math.sin(t * this.speed + this.phaseOffset) * this.amplitude;
    }, 1000 / 60);

    this._animTimer = setInterval(() => {
      if (this.isDead) return;
      if (this.isDangerous) this.playAnimation(this.IMAGES_DANGEROUS);
      else this.playAnimation(this.IMAGES_SWIMMING);
    }, 150);

    setInterval(() => {
      if (this.isDead) return;
      this.isDangerous = !this.isDangerous;
    }, 6000);
  }

  /**
   * Kill the jellyfish, play the appropriate death animation, then float
   * the corpse upward for a short duration and flag for removal.
   * Safe to call only once.
   * @returns {void}
   */
  die() {
    if (this.isDead) return;
    this.isDead = true;
    this.world?.audio?.playHurt();

    if (this._moveTimer) {
      clearInterval(this._moveTimer);
      this._moveTimer = null;
    }
    if (this._animTimer) {
      clearInterval(this._animTimer);
      this._animTimer = null;
    }

    const frames = this.isDangerous
      ? this.IMAGES_DEAD_GREEN
      : this.IMAGES_DEAD_LILA;

    let i = 0;
    const stepMs = 120;
    const run = setInterval(() => {
      this.img = this.imageCache[frames[i]];
      i++;
      if (i >= frames.length) {
        clearInterval(run);

        const stepPx = 5;
        const intervalMs = 16;
        let steps = 36;
        const floatUp = setInterval(() => {
          this.y -= stepPx;
          if (--steps <= 0) {
            clearInterval(floatUp);
            this.markForRemoval = true;
          }
        }, intervalMs);
      }
    }, stepMs);
  }
}