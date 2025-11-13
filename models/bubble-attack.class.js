class Bubble extends MovableObject {
    constructor(x, y, isPoison, dirLeft) {
        super();
        this.x = x; this.y = y;
        this.width = 50; this.height = 50;
        this.offset = { top: 8, left: 8, right: 8, bottom: 8 };
  
        this.otherDirection = !!dirLeft;
  
        this.loadImage(
        isPoison
          ? 'img/2.Sharkie/4.Attack/Bubble trap/Poisoned Bubble (for whale).png'
          : 'img/2.Sharkie/4.Attack/Bubble trap/Bubble.png'
        );
  
        const dx = dirLeft ? -8 : 8;
        this._moveTimer = setInterval(() => { this.x += dx; }, 30);
    }
  
    destroy() {
      if (this._moveTimer) { clearInterval(this._moveTimer); this._moveTimer = null; }
      this.markForRemoval = true;
    }
}