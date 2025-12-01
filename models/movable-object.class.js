/**
 * Base class for all moveable entities (player, enemies, projectiles).
 * Adds movement, hit logic, simple AABB collision with per-side offsets,
 * and sprite animation frame cycling.
 *
 * @extends DrawbleObject
 *
 * @property {number} speed
 *   Horizontal movement delta applied per tick (used by timers/loops).
 * @property {boolean} otherDirection
 *   When true, the sprite is considered facing left (used for flipping).
 * @property {number} energy
 *   Current health (0–100). 0 means dead.
 * @property {number} lastHit
 *   Timestamp (ms since epoch) of the last successful hit (damage debounce).
 * @property {{top:number,left:number,right:number,bottom:number}} offset
 *   Hitbox padding used in collision checks.
 * @property {?World} [world]
 *   Assigned by the World to allow audio access and level boundaries.
 * @property {?number} [_moveLeftTimer]
 *   Internal interval id for continuous left movement (60 FPS).
 */
class MovableObject extends DrawbleObject {
  speed = 0.15;
  otherDirection = false;
  energy = 100;
  lastHit = 0;

  offset = { top: 0, left: 0, right: 0, bottom: 0 };

  /**
   * Axis-aligned bounding-box collision using each object's offset.
   * @param {MovableObject|DrawbleObject} mo - Other object to test against.
   * @returns {boolean} True if the two rectangles overlap.
   */
  isColliding(mo) {
    if (!mo) return false;

    const a = this.offset || { top: 0, left: 0, right: 0, bottom: 0 };
    const b = mo.offset || { top: 0, left: 0, right: 0, bottom: 0 };

    return (
      this.x + this.width - a.right > mo.x + b.left &&
      this.x + a.left < mo.x + mo.width - b.right &&
      this.y + this.height - a.bottom > mo.y + b.top &&
      this.y + a.top < mo.y + mo.height - b.bottom
    );
  }

  /**
   * Applies damage with a 600ms invulnerability window and plays hurt SFX.
   * @param {number} [dmg=5] - Damage to subtract from energy.
   * @returns {void}
   */
  hit(dmg = 5) {
    if (this.world?.gameEnded) return;
    if (Date.now() - this.lastHit < 600) return;

    this.energy = Math.max(0, this.energy - dmg);
    this.lastHit = Date.now();
    this.world?.audio?.playHurt();
  }

  /**
   * Indicates if the object is in the post-hit (hurt) state.
   * @returns {boolean} True while within 0.6s after last hit.
   */
  isHurt() {
    return (Date.now() - this.lastHit) / 1000 < 0.6;
  }

  /**
   * Checks if the entity has no remaining energy.
   * @returns {boolean} True when energy <= 0.
   */
  isDead() {
    return this.energy <= 0;
  }

  /**
   * Cycles through a list of frame image paths using currentImage index.
   * @param {string[]} images - Ordered sprite frame paths.
   * @returns {void}
   */
  playAnimation(images) {
    if (!images || images.length === 0) return;
    const i = this.currentImage % images.length;
    const path = images[i];
    this.img = this.imageCache[path] || this.img;
    this.currentImage++;
  }

  /**
   * Starts continuous left movement at ~60 FPS (clears prior timer).
   * @returns {void}
   */
  moveLeft() {
    if (this._moveLeftTimer) clearInterval(this._moveLeftTimer);
    this._moveLeftTimer = setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }

  /**
   * Stops the continuous left movement interval if running.
   * @returns {void}
   */
  stopMoveLeft() {
    if (this._moveLeftTimer) {
      clearInterval(this._moveLeftTimer);
      this._moveLeftTimer = null;
    }
  }

  /**
   * Performs a single-step right movement by {@link speed}.
   * @returns {void}
   */
  moveRight() {
    this.x += this.speed;
  }
}
