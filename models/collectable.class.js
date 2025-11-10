class Collectable extends MovableObject {
  width = 40; height = 40;

  frames = null;
  animTimer = null;
  animSpeed = 180;
  kind = 'coin';

  constructor(x, y, spriteOrFrames) {
    super();
    this.x = x; this.y = y;

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

  startAnim() {
    if (!this.frames || !this.frames.length) return;
    if (this.animTimer) clearInterval(this.animTimer);
    this.animTimer = setInterval(() => this.playAnimation(this.frames), this.animSpeed);
  }

  stopAnim() {
    if (this.animTimer) {
      clearInterval(this.animTimer);
      this.animTimer = null;
    }
  }

  static coin(x, y) {
    const c = new Collectable(x, y, [
      'img/5.Marcadores/1. Coins/1.png',
      'img/5.Marcadores/1. Coins/2.png',
      'img/5.Marcadores/1. Coins/3.png',
      'img/5.Marcadores/1. Coins/4.png'
    ]);
    c.kind = 'coin';
    return c;
  }

  static poisonLeft(x, y) {
    const p = new Collectable(x, y, 'img/5.Marcadores/Poison/DarkLeft.png');
    p.kind = 'poison';
    p.width = 70; p.height = 90;
    return p;
  }

  static poisonRight(x, y) {
    const p = new Collectable(x, y, 'img/5.Marcadores/Poison/DarkRight.png');
    p.kind = 'poison';
    p.width = 70; p.height = 90;
    return p;
  }
}