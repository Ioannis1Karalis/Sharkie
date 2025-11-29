/**
 * UI status bar that visualizes the player's poison ammo (0–100%).
 * Renders a pre-baked sprite based on discrete thresholds (0/20/40/60/80/100).
 *
 * @extends DrawbleObject
 *
 * @property {string[]} IMAGES
 *   Ordered sprite frames from empty (index 0) to full (index 5).
 * @property {number} percentage
 *   Current fill level in percent (0–100). Controls which sprite is shown.
 */
class PoisonBar extends DrawbleObject {
  IMAGES = [
    "img/5.Marcadores/green/poisoned bubbles/0_ copia 2.png",
    "img/5.Marcadores/green/poisoned bubbles/20_ copia 3.png",
    "img/5.Marcadores/green/poisoned bubbles/40_ copia 2.png",
    "img/5.Marcadores/green/poisoned bubbles/60_ copia 2.png",
    "img/5.Marcadores/green/poisoned bubbles/80_ copia 2.png",
    "img/5.Marcadores/green/poisoned bubbles/100_ copia 3.png"
  ];

  percentage = 100;

  /**
   * Creates the bar, loads frames, positions it in the HUD, and initializes to 0%.
   * Inherited size/position fields are set for top-left placement.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 20;
    this.y = 0;
    this.width = 200;
    this.height = 60;
    this.setPercentage(0);
  }

  /**
   * Updates the bar fill level and swaps the sprite accordingly.
   * Values are clamped implicitly by the index resolver.
   *
   * @param {number} percentage - New fill level (0–100).
   * @returns {void}
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    const path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Maps the current percentage to a sprite index.
   * Thresholds are inclusive: 0, ≥20, ≥40, ≥60, ≥80, ≥100.
   *
   * @returns {number} Index in {@link IMAGES} (0–5).
   */
  resolveImageIndex() {
    if (this.percentage >= 100) return 5;
    if (this.percentage >= 80) return 4;
    if (this.percentage >= 60) return 3;
    if (this.percentage >= 40) return 2;
    if (this.percentage >= 20) return 1;
    return 0;
  }
}
