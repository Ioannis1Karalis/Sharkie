/**
 * Projectile bubble fired by the character.
 * Moves horizontally until destroyed; can be a poison variant.
 *
 * @extends MovableObject
 * @property {boolean} isPoison - Whether this bubble is poisonous.
 * @property {number} x - Current world x-position.
 * @property {number} y - Current world y-position.
 * @property {number} width - Bubble sprite width (px).
 * @property {number} height - Bubble sprite height (px).
 * @property {{top:number,left:number,right:number,bottom:number}} offset - Hitbox padding.
 * @property {boolean} otherDirection - When true the sprite is drawn flipped (moving left).
 * @property {number|null} moveTimer - Interval id for movement; cleared on destroy.
 */
class Bubble extends MovableObject {
  /**
   * Create a bubble projectile.
   * @param {number} x - Spawn x-position.
   * @param {number} y - Spawn y-position.
   * @param {boolean} isPoison - If true, uses the poison bubble sprite.
   * @param {boolean} dirLeft - If true, bubble travels left; otherwise right.
   */
  constructor(x, y, isPoison, dirLeft) {
    super();
    this.isPoison = !!isPoison;
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.offset = { top: 8, left: 8, right: 8, bottom: 8 };
    this.otherDirection = !!dirLeft;

    this.loadImage(
      isPoison
        ? "img/2.Sharkie/4.Attack/Bubble trap/Poisoned Bubble (for whale).png"
        : "img/2.Sharkie/4.Attack/Bubble trap/Bubble.png"
    );
    const dx = dirLeft ? -8 : 8;
    this.moveTimer = setInterval(() => {
      this.x += dx;
    }, 30);
  }

  /**
   * Stop movement and mark the bubble for removal by the world loop.
   * Clears the movement timer and sets {@link Bubble#markForRemoval}.
   */
  destroy() {
    if (this.moveTimer) {
      clearInterval(this.moveTimer);
      this.moveTimer = null;
    }
    this.markForRemoval = true;
  }
}