/**
 * HUD coin progress bar (0–100%) using six discrete sprites.
 * The image is chosen by threshold (>20, >40, >60, >80, >=100).
 *
 * @extends DrawbleObject
 * @property {string[]} IMAGES - Sprite paths ordered from 0% to 100%.
 * @property {number} percentage - Current fill level (0–100).
 * @property {number} x - Canvas x position.
 * @property {number} y - Canvas y position.
 * @property {number} width - Render width in pixels.
 * @property {number} height - Render height in pixels.
 */
class CoinsBar extends DrawbleObject {
  IMAGES = [
    "img/5.Marcadores/green/Coin/0_  copia 4.png",
    "img/5.Marcadores/green/Coin/20_  copia 2.png",
    "img/5.Marcadores/green/Coin/40_  copia 4.png",
    "img/5.Marcadores/green/Coin/60_  copia 4.png",
    "img/5.Marcadores/green/Coin/80_  copia 4.png",
    "img/5.Marcadores/green/Coin/100_ copia 4.png",
  ];

  percentage = 100;

  /**
   * Preloads sprites, sets position/size, and initializes to 0%.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 20;
    this.y = 80;
    this.width = 200;
    this.height = 60;
    this.setPercentage(0);
  }

  /**
   * Updates the visual to match the given percentage.
   * @param {number} percentage - New fill (0–100).
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Maps the current percentage to a sprite index.
   * @returns {number} Index in {@link IMAGES}.
   */
  resolveImageIndex() {
    if (this.percentage >= 100) return 5;
    if (this.percentage > 80) return 4;
    if (this.percentage > 60) return 3;
    if (this.percentage > 40) return 2;
    if (this.percentage > 20) return 1;
    return 0;
  }
}