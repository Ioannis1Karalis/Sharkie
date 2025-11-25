class MovableObject extends DrawbleObject {
  speed = 0.15;
  otherDirection = false;
  energy = 100;
  lastHit = 0;

  offset = { top: 0, left: 0, right: 0, bottom: 0 };

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

  hit(dmg = 5) {
    if (Date.now() - this.lastHit < 600) return;

    this.energy = Math.max(0, this.energy - dmg);
    this.lastHit = Date.now();
    this.world?.audio?.playHurt();
  }

  isHurt() {
    return (Date.now() - this.lastHit) / 1000 < 0.6;
  }

  isDead() {
    return this.energy <= 0;
  }

  playAnimation(images) {
    if (!images || images.length === 0) return;
    const i = this.currentImage % images.length;
    const path = images[i];
    this.img = this.imageCache[path] || this.img;
    this.currentImage++;
  }

  moveLeft() {
    if (this._moveLeftTimer) clearInterval(this._moveLeftTimer);
    this._moveLeftTimer = setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }

  stopMoveLeft() {
    if (this._moveLeftTimer) {
      clearInterval(this._moveLeftTimer);
      this._moveLeftTimer = null;
    }
  }

  moveRight() {
    this.x += this.speed;
  }
}
