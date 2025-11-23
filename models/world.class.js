class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;

  healthBar = new HealthBar();
  coinsBar = new CoinsBar();
  poisonBar = new PoisonBar();
  barrier = new Barrier();

  coinsCollected = 0;
  POISON_MAX = 6;
  poisonAmmo = 0;
  COINS_TARGET = 10;

  bubbles = [];
  firedD = false;
  firedSpace = false;
  fireLock = false;

  endboss = null;
  endbossTriggered = false;

  gameEnded = false;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;

    this.setWorld();

    this.endboss = this.level.enemies.find((e) => e instanceof Endboss) || null;

    this.startCollectableAnims();
    this.swim();
    this.draw();
  }

  setWorld() {
    this.character.world = this;
    (this.level.enemies || []).forEach((e) => (e.world = this));
  }

  swim() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowableObjects();
      this.checkCollectablePickup?.();

      this.checkBossTrigger();

      this.checkBubbleHits();
      this.cleanupCorpsesAndBubbles?.();
    }, 200);
  }

  startCollectableAnims() {
    const items = this.level.collectableItems || [];
    items.forEach((it) => {
      if (it.startAnim) it.startAnim();
    });
  }

  checkCollectablePickup() {
    const items = this.level.collectableItems || [];
    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i];
      if (!this.character.isColliding(it)) continue;

      if (it.stopAnim) it.stopAnim();

      if (it.kind === "coin") {
        this.coinsCollected++;
        const pct = Math.min(
          100,
          (this.coinsCollected / this.COINS_TARGET) * 100
        );
        this.coinsBar.setPercentage(pct);
      } else if (it.kind === "poison") {
        this.poisonAmmo++;
        this.updatePoisonBar();
      }

      items.splice(i, 1);
    }
  }

  checkThrowableObjects() {
    if (this.keyboard.D && !this.firedD) {
      this.firedD = true;
      if (this.character.throwNormal) {
        this.character.throwNormal();
      } else {
        this.spawnBubble(false);
      }
    }
    if (!this.keyboard.D) this.firedD = false;

    if (this.keyboard.SPACE && !this.firedSpace) {
      this.firedSpace = true;
      if (this.poisonAmmo > 0) {
        if (this.character.throwPoison) {
          this.character.throwPoison();
        } else {
          this.poisonAmmo--;
          this.updatePoisonBar();
          this.spawnBubble(true);
        }
      }
    }
    if (!this.keyboard.SPACE) this.firedSpace = false;
  }

  updatePoisonBar() {
    const pct = Math.min(100, (this.poisonAmmo / this.POISON_MAX) * 100);
    this.poisonBar.setPercentage(pct);
  }

  spawnBubble(isPoison) {
    const c = this.character;
    const dirLeft = c.otherDirection === true;
    const startX = dirLeft ? c.x - 10 : c.x + c.width - 10;
    const startY = c.y + c.height * 0.5 - 20;
    const b = new Bubble(startX, startY, isPoison, dirLeft);
    this.bubbles.push(b);
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (!this.character.isColliding(enemy)) return;
      if (Date.now() - this.character.lastHit < 600) return;

      if (enemy instanceof Endboss) {
        if (enemy.state === "attack" && this.character.isColliding(enemy)) {
          this.character.hit(10);
          this.healthBar.setPercentage(this.character.energy);
        }
        return;
      }

      if (enemy instanceof JellyFish) {
        if (enemy.isDangerous) {
          this.character.isElectrocuted = true;
          this.character.isPoisoned = false;
          setTimeout(() => {
            this.character.isElectrocuted = false;
          }, 800);
        } else {
          this.character.isPoisoned = true;
          setTimeout(() => {
            this.character.isPoisoned = false;
          }, 800);
        }
        this.character.hit();
        this.healthBar.setPercentage(this.character.energy);
        return;
      }

      if (enemy instanceof PufferFishGreen || enemy instanceof PufferFishRed) {
        if (enemy.mode === "bubble" || enemy.mode === "transition") {
          this.character.isPoisoned = true;
          this.character.isElectrocuted = false;
          setTimeout(() => {
            this.character.isPoisoned = false;
          }, 800);
        }
        this.character.hit();
        this.healthBar.setPercentage(this.character.energy);
        return;
      }

      this.character.hit();
      this.healthBar.setPercentage(this.character.energy);
    });
  }

  checkBubbleHits() {
    if (!this.bubbles || !this.level.enemies) return;

    for (let bi = this.bubbles.length - 1; bi >= 0; bi--) {
      const b = this.bubbles[bi];

      for (let ei = this.level.enemies.length - 1; ei >= 0; ei--) {
        const e = this.level.enemies[ei];
        if (!b.isColliding(e)) continue;

        if (typeof b.destroy === "function") b.destroy();
        else b.markForRemoval = true;

        if (e instanceof Endboss) {
          if (b.isPoison && typeof e.takeHit === "function") e.takeHit();

          if (typeof b.destroy === "function") b.destroy();
          this.bubbles.splice(bi, 1);

          break;
        }

        if (
          (e instanceof PufferFishGreen || e instanceof PufferFishRed) &&
          typeof e.die === "function"
        ) {
          e.die();
          break;
        }

        if (e instanceof JellyFish) {
          if (!e.isDangerous && typeof e.die === "function") e.die();
          break;
        }
      }
    }
  }

  cleanupCorpsesAndBubbles() {
    this.level.enemies = this.level.enemies.filter((e) => !e.markForRemoval);
    this.bubbles = this.bubbles.filter((b) => !b.markForRemoval);
  }

  checkBossTrigger() {
    if (!this.endboss || this.endbossTriggered) return;

    if (this.character.x >= 4100) {
      this.endbossTriggered = true;

      if (this.endboss.state === "hidden" || this.endboss.hidden === true) {
        if (typeof this.endboss.startIntro === "function") {
          this.endboss.startIntro();
        } else if (typeof this.endboss.triggerIntro === "function") {
          this.endboss.triggerIntro();
        } else {
          this.endboss.state = "idle";
          this.endboss.hidden = false;
        }
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Boss-Logik (weiterlaufen lassen; Overlay liegt oben drüber)
    if (this.endboss && typeof this.endboss.update === "function") {
      this.endboss.update(this.character);
    }

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.collectableItems);
    this.addToMap(this.barrier);

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.poisonBar);
    this.addToMap(this.healthBar);
    this.addToMap(this.coinsBar);

    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.bubbles);
    this.ctx.translate(-this.camera_x, 0);

    requestAnimationFrame(() => this.draw());
  }

  addObjectsToMap(objects) {
    if (!objects || !objects.forEach) return;
    objects.forEach((o) => this.addToMap(o));
  }

  addToMap(mo) {
    if (mo && (mo.state === "hidden" || mo.hidden === true)) return;

    if (mo.otherDirection) this.flipImage(mo);
    mo.draw(this.ctx);
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

  scheduleEndGame(result /* 'win' | 'lose' */) {
    if (this._endScheduled) return;
    this._endScheduled = true;
    this.showEndOverlay(result);
  }

  showEndOverlay(result /* 'win' | 'lose' */) {
    if (this._endOverlayShown) return;
    this._endOverlayShown = true;

    // ← Alles ausblenden
    this.hideActors();

    const root = document.getElementById("game-container");
    const overlay = root?.querySelector("#end-overlay");
    if (!overlay) {
      console.warn(
        "#end-overlay nicht gefunden (muss innerhalb von #game-container liegen)."
      );
      return;
    }

    const img = overlay.querySelector("#end-image");
    img.src = result === "win" ? "img/icons/win.png" : "img/icons/gameover.png";
    img.alt = result === "win" ? "You win" : "Game Over";

    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden", "false");

    const restart = overlay.querySelector("#restart-btn");
    const backdrop = overlay.querySelector(".end-backdrop");
    const doRestart = () => {
      sessionStorage.setItem("AUTO_START", "1");
      location.reload();
    };
    restart?.addEventListener("click", doRestart);
    backdrop?.addEventListener("click", doRestart);
  }

  hideActors() {
    if (this.character) this.character.hidden = true;
    (this.level?.enemies || []).forEach((e) => (e.hidden = true));
    (this.bubbles || []).forEach((b) => (b.hidden = true));
    if (this.healthBar) this.healthBar.hidden = true;
    if (this.coinsBar) this.coinsBar.hidden = true;
    if (this.poisonBar) this.poisonBar.hidden = true;
  }
}
