class JellyFish extends MovableObject {
    height = 90;
    width = 100;

    IMAGES_SWIMMING = [
        'img/3.Enemy/2 Jelly fish/Regular damage/Lila 1.png',
        'img/3.Enemy/2 Jelly fish/Regular damage/Lila 2.png',
        'img/3.Enemy/2 Jelly fish/Regular damage/Lila 3.png',
        'img/3.Enemy/2 Jelly fish/Regular damage/Lila 4.png'
    ];

    IMAGES_DANGEROUS = [
        'img/3.Enemy/2 Jelly fish/Super dangerous/Green 1.png',
        'img/3.Enemy/2 Jelly fish/Super dangerous/Green 2.png',
        'img/3.Enemy/2 Jelly fish/Super dangerous/Green 3.png',
        'img/3.Enemy/2 Jelly fish/Super dangerous/Green 4.png'
    ];

    IMAGES_DEAD_LILA = [
        'img/3.Enemy/2 Jelly fish/Dead/Lila/L1.png',
        'img/3.Enemy/2 Jelly fish/Dead/Lila/L2.png',
        'img/3.Enemy/2 Jelly fish/Dead/Lila/L3.png',
        'img/3.Enemy/2 Jelly fish/Dead/Lila/L4.png'
    ];

    IMAGES_DEAD_GREEN = [
        'img/3.Enemy/2 Jelly fish/Dead/green/g1.png',
        'img/3.Enemy/2 Jelly fish/Dead/green/g2.png',
        'img/3.Enemy/2 Jelly fish/Dead/green/g3.png',
        'img/3.Enemy/2 Jelly fish/Dead/green/g4.png'
    ];

    constructor(x, y) {
        super().loadImage(this.IMAGES_SWIMMING[0]);
        this.loadImages(this.IMAGES_SWIMMING);
        this.loadImages(this.IMAGES_DANGEROUS);
        this.loadImages(this.IMAGES_DEAD_LILA);
        this.loadImages(this.IMAGES_DEAD_GREEN);
    
        this.x = x || 850;
        this.y = y || 200;
    
        this.startY    = this.y;
        this.amplitude = 155;
        this.speed     = 0.001;
        this.phaseOffset = Math.random() * Math.PI * 2;
    
        this.offset = { top: 5, left: 5, right: 5, bottom: 5 };
    
        this.isDangerous = false;
        this.isDead      = false;
        this.markForRemoval = false;
    
        this._moveTimer = null;
        this._animTimer = null;
    
        this.animate();
    }
    
    animate() {
        this._moveTimer = setInterval(() => {
          if (this.isDead) return;
          const t = Date.now();
          this.y = this.startY + Math.sin(t * this.speed + this.phaseOffset) * this.amplitude;
        }, 1000 / 60);
    
        this._animTimer = setInterval(() => {
          if (this.isDead) return;
          if (this.isDangerous) this.playAnimation(this.IMAGES_DANGEROUS);
          else                  this.playAnimation(this.IMAGES_SWIMMING);
        }, 150);
    
        setInterval(() => {
          if (this.isDead) return;
          this.isDangerous = !this.isDangerous;
        }, 6000);
    }
    
    die() {
        if (this.isDead) return;
        this.isDead = true;
    
        if (this._moveTimer) { clearInterval(this._moveTimer); this._moveTimer = null; }
        if (this._animTimer) { clearInterval(this._animTimer); this._animTimer = null; }
    
        const frames = this.isDangerous ? this.IMAGES_DEAD_GREEN : this.IMAGES_DEAD_LILA;
    
        let i = 0;
        const stepMs = 120;
        const run = setInterval(() => {
          this.img = this.imageCache[frames[i]];
          i++;
          if (i >= frames.length) {
            clearInterval(run);
            let steps = 20;
            const floatUp = setInterval(() => {
              this.y -= 2;
              steps--;
              if (steps <= 0) {
                clearInterval(floatUp);
                this.markForRemoval = true;
              }
            }, 30);
        }}, stepMs);
    }
}