/**
 * UI health bar that visualizes the player's remaining health as a staged sprite.
 * Uses a fixed set of images at 0/20/40/60/80/100% steps and swaps the sprite
 * based on the current percentage.
 *
 * @extends DrawbleObject
 * @property {string[]} IMAGES - Sprite frames ordered from empty to full.
 * @property {number} percentage - Current health percentage [0..100].
 */
class HealthBar extends DrawbleObject {

    IMAGES = [
      'img/5.Marcadores/green/Life/0_  copia 3.png',
      'img/5.Marcadores/green/Life/20_ copia 4.png',
      'img/5.Marcadores/green/Life/40_  copia 3.png',
      'img/5.Marcadores/green/Life/60_  copia 3.png',
      'img/5.Marcadores/green/Life/80_  copia 3.png',
      'img/5.Marcadores/green/Life/100_  copia 2.png'
    ];
  
    percentage = 100;
  
    /**
     * Create the health bar, preload frames, place it on screen,
     * and initialize to 100%.
     */
    constructor() {
      super();
      this.loadImages(this.IMAGES);
      this.x = 20;
      this.y = 40;
      this.width = 200;
      this.height = 60;
      this.setPercentage(100);
    };
  
    /**
     * Set the current health percentage and update the displayed sprite.
     * Values outside [0..100] are not clamped here; provide clamped values.
     * @param {number} percentage - Health percentage to render.
     * @returns {void}
     */
    setPercentage(percentage) {
      this.percentage = percentage;
      const path = this.IMAGES[this.resolveImageIndex()];
      this.img = this.imageCache[path];
    };
        
    /**
     * Resolve which sprite index to use based on the current percentage.
     * @private
     * @returns {number} Index into {@link IMAGES}.
     */
    resolveImageIndex() {
      if (this.percentage == 100) return 5;
      if (this.percentage > 80)  return 4;
      if (this.percentage > 60)  return 3;
      if (this.percentage > 40)  return 2;
      if (this.percentage > 20)  return 1;
      return 0;
    };
  }