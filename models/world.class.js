class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
  
    healthBar = new HealthBar();
    coinsBar  = new CoinsBar();
    poisonBar = new PoisonBar();
  
    bubbleAttack = [new BubbleAttack()];
    barrier = new Barrier();
  
    coinsCollected = 0;  
    poisonAmmo     = 0; 
    COINS_TARGET   = 10; 
    POISON_PER_100 = 5; 
    fireLock = false;   

    constructor(canvas, keyboard) {
      this.ctx = canvas.getContext('2d');
      this.canvas = canvas;
      this.keyboard = keyboard;
  
      this.draw();
      this.setWorld();
      this.swim();
  
      this.startCollectableAnims();
    }
  
    setWorld() {
      this.character.world = this;
    }
  
    swim() {
      setInterval(() => {
        this.checkCollisions();
        this.checkThrowableObjects();
        this.checkCollectablePickup();
      }, 200);
    }
  
    startCollectableAnims() {
      const items = this.level.collectableItems || [];
      items.forEach(it => {
        if (it.startAnim) it.startAnim();
      });
    }
  
    checkCollectablePickup() {
      const items = this.level.collectableItems || [];
      for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i];
        if (this.character.isColliding(it)) {
  
          if (it.stopAnim) it.stopAnim();
  
          if (it.kind === 'coin') {
            this.coinsCollected++;
            const pct = Math.min(100, (this.coinsCollected / this.COINS_TARGET) * 100);
            this.coinsBar.setPercentage(pct);
          } else if (it.kind === 'poison') {
            this.poisonAmmo++;
            const pct = Math.min(100, (this.poisonAmmo / this.POISON_PER_100) * 100);
            this.poisonBar.setPercentage(pct);
          }
  
          items.splice(i, 1);
        }
      }
    }
  
    checkThrowableObjects() {
      if (this.keyboard.SPACE && this.poisonAmmo > 0 && !this.fireLock) {
        this.fireLock = true;
  
        this.poisonAmmo = Math.max(0, this.poisonAmmo - 1);
        const pct = Math.min(100, (this.poisonAmmo / this.POISON_PER_100) * 100);
        this.poisonBar.setPercentage(pct);
  
        const bubble = new BubbleAttack(this.character.x, this.character.y + 100);
        this.bubbleAttack.push(bubble);
  
        setTimeout(() => { this.fireLock = false; }, 180);
      }
    }
  
    checkCollisions() {
      this.level.enemies.forEach((enemy) => {
        if (!this.character.isColliding(enemy)) return;
  
        if (Date.now() - this.character.lastHit < 600) return;
  
        if (enemy instanceof JellyFish) {
          if (enemy.isDangerous) {
            this.character.isElectrocuted = true;
            this.character.isPoisoned = false;
            setTimeout(() => { this.character.isElectrocuted = false; }, 800);
          } else {
            this.character.isPoisoned = true;
            setTimeout(() => { this.character.isPoisoned = false; }, 800);
          }
        }
  
        if (enemy instanceof PufferFishGreen || enemy instanceof PufferFishRed) {
          if (enemy.mode === 'bubble' || enemy.mode === 'transition') {
            this.character.isPoisoned = true;
            this.character.isElectrocuted = false;
            setTimeout(() => { this.character.isPoisoned = false; }, 800);
          }
        }
  
        this.character.hit();
        this.healthBar.setPercentage(this.character.energy);
      });
    }
  
    draw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
      this.ctx.translate(this.camera_x, 0);
      this.addObjectsToMap(this.level.backgroundObjects);
      this.addToMap(this.barrier);
  
      this.ctx.translate(-this.camera_x, 0);
      this.addToMap(this.poisonBar);
      this.addToMap(this.healthBar);
      this.addToMap(this.coinsBar);
  
      this.ctx.translate(this.camera_x, 0);
  
      this.addObjectsToMap(this.level.collectableItems);
  
      this.addToMap(this.character);
      this.addObjectsToMap(this.level.enemies);
      this.addObjectsToMap(this.bubbleAttack);
  
      this.ctx.translate(-this.camera_x, 0);
  
      requestAnimationFrame(() => this.draw());
    }
  
    addObjectsToMap(objects) {
      if (!objects || !objects.forEach) return;
      objects.forEach(o => this.addToMap(o));
    }
  
    addToMap(mo) {
      if (mo.otherDirection) this.flipImage(mo);
  
      mo.draw(this.ctx);
      mo.drawFrame(this.ctx);
  
      if (mo.otherDirection) this.flipImageBack(mo);
    }
  
    flipImage(mo) {
      this.ctx.save();
      this.ctx.translate(mo.width, 0);
      this.ctx.scale(-1, 1);
      mo.x = mo.x * -1;
    }
  
    flipImageBack(mo) {
      mo.x = mo.x * -1;
      this.ctx.restore();
    }
  }