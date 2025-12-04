/**
 * Main game world: ties together the canvas, player, enemies, collectibles,
 * HUD bars, audio, and the main loops for physics/collisions/rendering.
 *
 * Responsibilities:
 * - Instantiate and wire all game actors (character, enemies, HUD, audio).
 * - Run periodic logic loops (collision checks, pickups, boss triggers).
 * - Manage projectiles (bubbles) and their interactions with enemies.
 * - Orchestrate the render loop and camera translation.
 * - Display and control the end-of-game overlay.
 *
 * @property {Character} character Player character instance.
 * @property {Level} level Active level definition (actors, background, pickups).
 * @property {HTMLCanvasElement} canvas Target canvas element.
 * @property {CanvasRenderingContext2D} ctx 2D drawing context.
 * @property {Keyboard} keyboard Input state.
 * @property {number} camera_x Horizontal camera offset.
 * @property {HealthBar} healthBar UI bar for health.
 * @property {CoinsBar} coinsBar UI bar for coins.
 * @property {PoisonBar} poisonBar UI bar for poison ammo.
 * @property {Barrier} barrier Static foreground/background object.
 * @property {number} coinsCollected Collected coins counter.
 * @property {number} POISON_MAX Max poison capacity.
 * @property {number} poisonAmmo Current poison ammo count.
 * @property {number} COINS_TARGET Coins needed for 100% bar.
 * @property {Bubble[]} bubbles Active projectile list.
 * @property {boolean} firedD One-shot key latch for normal bubbles.
 * @property {boolean} firedSpace One-shot key latch for poison bubbles.
 * @property {boolean} fireLock Prevents overlapping poison throws.
 * @property {Endboss|null} endboss Cached reference to boss (if present).
 * @property {boolean} endbossTriggered Whether boss intro was triggered.
 * @property {boolean} gameEnded Game over state guard.
 * @property {AudioManager} audio Shared audio manager (window.audio).
 */
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
  firedF = false;

  endboss = null;
  endbossTriggered = false;

  gameEnded = false;

  /**
   * Create a new world bound to a canvas and keyboard state.
   * Starts collectible animations, logic loop, and render loop.
   * @param {HTMLCanvasElement} canvas
   * @param {Keyboard} keyboard
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.audio = window.audio;
    this.setWorld();

    this.endboss = this.level.enemies.find((e) => e instanceof Endboss) || null;

    this.startCollectableAnims();
    this.swim();
    this.draw();
  }

  /** Inject world reference into character and enemies. */
  setWorld() {
    this.character.world = this;
    (this.level.enemies || []).forEach((e) => (e.world = this));
  }

  /**
   * Main fixed-interval logic loop (200 ms):
   * collisions, throwing, pickups, boss trigger, projectile cleanup.
   */
  swim() {
    setInterval(() => {
      if (this.gameEnded) return; // ← hinzugefügt
      this.checkCollisions();
      this.checkThrowableObjects();
      this.checkCollectablePickup?.();
      this.checkBossTrigger();
      this.checkBubbleHits();
      this.cleanupCorpsesAndBubbles?.();
    }, 200);
  }

  /** Start idle/float animations for all collectibles (if any). */
  startCollectableAnims() {
    const items = this.level.collectableItems || [];
    items.forEach((it) => {
      if (it.startAnim) it.startAnim();
    });
  }

  /**
   * Resolve player pickups (coins/poison), update bars, play SFX,
   * and remove taken items.
   */
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
        this.audio?.playCoin?.();
      } else if (it.kind === "poison") {
        this.poisonAmmo++;
        this.updatePoisonBar();
        this.audio?.playPoison?.();
      }
      items.splice(i, 1);
    }
  }

  /**
   * Handle input latches and spawn attacks:
   * D = normal bubble, SPACE = poison bubble (consumes ammo).
   */
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
    if (this.keyboard.F && !this.firedF) {
        this.firedF = true;
        if (this.character.finSlap) this.character.finSlap();
      }
      if (!this.keyboard.F) this.firedF = false;
  }

  /** Update poison bar percentage from current ammo. */
  updatePoisonBar() {
    const pct = Math.min(100, (this.poisonAmmo / this.POISON_MAX) * 100);
    this.poisonBar.setPercentage(pct);
  }

  /**
   * Spawn a projectile bubble at the character’s mouth line.
   * @param {boolean} isPoison Whether the bubble is the poison variant.
   */
  spawnBubble(isPoison) {
    const c = this.character;
    const dirLeft = c.otherDirection === true;
    const startX = dirLeft ? c.x - 10 : c.x + c.width - 10;
    const startY = c.y + c.height * 0.5 - 20;
    const b = new Bubble(startX, startY, isPoison, dirLeft);
    this.bubbles.push(b);
  }

  /**
   * Check and resolve character collisions against all enemies,
   * delegating per-enemy-type handling; applies damage and status effects.
   */
  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (!this.character.isColliding(enemy)) return;
      if (Date.now() - this.character.lastHit < 600) return;
      if (this.handleEndbossCollision(enemy)) return;
      if (this.handleJellyCollision(enemy)) return;
      if (this.handlePufferCollision(enemy)) return;
      this.applyHit();
    });
  }

  /**
   * Handle collision with Endboss.
   * @param {any} enemy
   * @returns {boolean} True if handled.
   */
  handleEndbossCollision(enemy) {
    if (!(enemy instanceof Endboss)) return false;
    if (enemy.state === "attack" && this.character.isColliding(enemy)) {
      this.character.hit(10);
      this.healthBar.setPercentage(this.character.energy);
    }
    return true;
  }

  /**
   * Handle collision with JellyFish (dangerous toggles electrocution).
   * @param {any} enemy
   * @returns {boolean} True if handled.
   */
  handleJellyCollision(enemy) {
    if (!(enemy instanceof JellyFish)) return false;
    if (enemy.isDangerous) {
      this.character.isElectrocuted = true;
      this.character.isPoisoned = false;
      setTimeout(() => (this.character.isElectrocuted = false), 800);
    } else {
      this.character.isPoisoned = true;
      setTimeout(() => (this.character.isPoisoned = false), 800);
    }
    this.applyHit();
    return true;
  }

  /**
   * Handle collision with puffer fish (green/red).
   * @param {any} enemy
   * @returns {boolean} True if handled.
   */
  handlePufferCollision(enemy) {
    if (!(enemy instanceof PufferFishGreen || enemy instanceof PufferFishRed))
      return false;
    if (enemy.mode === "bubble" || enemy.mode === "transition") {
      this.character.isPoisoned = true;
      this.character.isElectrocuted = false;
      setTimeout(() => (this.character.isPoisoned = false), 800);
    }
    this.applyHit();
    return true;
  }

  /** Apply damage to character and update health bar. */
  applyHit() {
    this.character.hit();
    this.healthBar.setPercentage(this.character.energy);
  }

  /**
   * Resolve projectile (bubble) collisions with enemies and apply effects
   * (boss damage, puffer/jelly kills, bubble destruction).
   */
  checkBubbleHits() {
    if (!this.bubbles || !this.level.enemies) return;
    for (let bi = this.bubbles.length - 1; bi >= 0; bi--) {
      const b = this.bubbles[bi];
      for (let ei = this.level.enemies.length - 1; ei >= 0; ei--) {
        const e = this.level.enemies[ei];
        if (!b.isColliding(e)) continue;
        this.touchBubble(b);
        if (this.handleEndbossHit(e, b, bi)) break;
        if (this.handlePufferHit(e)) break;
        if (this.handleJellyHit(e)) break;
      }
    }
  }

  /**
   * Mark bubble for removal or call its destroy() hook.
   * @param {Bubble} b
   */
  touchBubble(b) {
    if (typeof b.destroy === "function") b.destroy();
    else b.markForRemoval = true;
  }

  /**
   * Boss interaction with a bubble (only poison bubbles hurt the boss).
   * Removes the bubble on contact.
   * @param {any} e
   * @param {Bubble} b
   * @param {number} bi Bubble index
   * @returns {boolean} True if handled.
   */
  handleEndbossHit(e, b, bi) {
    if (!(e instanceof Endboss)) return false;
    if (b.isPoison && typeof e.takeHit === "function") e.takeHit();
    if (typeof b.destroy === "function") b.destroy();
    this.bubbles.splice(bi, 1);
    return true;
  }

  /**
   * Kill a puffer fish on bubble hit, if supported by the enemy instance.
   * @param {any} e
   * @returns {boolean} True if handled.
   */
  handlePufferHit(e) {
    if (
      (e instanceof PufferFishGreen || e instanceof PufferFishRed) &&
      typeof e.die === "function"
    ) {
      e.die();
      return true;
    }
    return false;
  }

  /**
   * Handle jellyfish hit: only kill when not dangerous.
   * @param {any} e
   * @returns {boolean} True if handled.
   */
  handleJellyHit(e) {
    if (!(e instanceof JellyFish)) return false;
    if (!e.isDangerous && typeof e.die === "function") e.die();
    return true;
  }

  /** Remove flagged enemies and bubbles from their arrays. */
  cleanupCorpsesAndBubbles() {
    this.level.enemies = this.level.enemies.filter((e) => !e.markForRemoval);
    this.bubbles = this.bubbles.filter((b) => !b.markForRemoval);
  }

  /**
   * Trigger boss intro sequence when the character reaches the threshold.
   * Ensures this happens only once.
   */
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

  /**
   * Main render loop (requestAnimationFrame):
   * clears frame, updates boss AI, draws background, HUD, actors, and projectiles.
   */
  draw() {
    if (!this._loaderNotified && typeof this.onFirstFrame === "function") {
      this._loaderNotified = true;
      this.onFirstFrame();
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

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

  /**
   * Draw a list of objects to the map (safe guard on missing arrays).
   * @param {Array<DrawbleObject|MovableObject>} objects
   */
  addObjectsToMap(objects) {
    if (!objects || !objects.forEach) return;
    objects.forEach((o) => this.addToMap(o));
  }

  /**
   * Draw a single mappable object, respecting hidden state and flip flags.
   * @param {DrawbleObject|MovableObject} mo
   */
  addToMap(mo) {
    if (mo && (mo.state === "hidden" || mo.hidden === true)) return;

    if (mo.otherDirection) this.flipImage(mo);
    mo.draw(this.ctx);
    if (mo.otherDirection) this.flipImageBack(mo);
  }

  /**
   * Apply horizontal flip for right-to-left sprites.
   * @param {MovableObject} mo
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Undo horizontal flip applied in {@link flipImage}.
   * @param {MovableObject} mo
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  /**
   * Schedule end screen once (idempotent).
   * @param {"win"|"lose"} result
   */
  scheduleEndGame(result) {
    if (this._endScheduled) return;
    this._endScheduled = true;
    this.gameEnded = true;

    this.audio?.stopBgm?.(); 
    try {
      this.audio?.sfxHurt?.pause();
      this.audio && (this.audio.sfxHurt.currentTime = 0);
    } catch {}

    this.showEndOverlay(result);
  }

  /**
   * Show the end overlay (win/lose), bind restart handlers,
   * and hide active actors behind the overlay.
   * @param {"win"|"lose"} result
   */
  showEndOverlay(result) {
    if (this._endOverlayShown) return;
    this._endOverlayShown = true;
    this.hideActors();
    const overlay = this.getEndOverlay();
    if (!overlay) return;
    this.setEndImage(overlay, result);
    this.openEndOverlay(overlay);
    this.bindRestart(overlay);
  }

  /**
   * Resolve the end overlay element from the DOM.
   * @returns {HTMLElement|null}
   */
  getEndOverlay() {
    const root = document.getElementById("game-container");
    const overlay = root?.querySelector("#end-overlay");
    return overlay;
  }

  /**
   * Configure end overlay image src/alt according to game result.
   * @param {HTMLElement} overlay
   * @param {"win"|"lose"} result
   */
  setEndImage(overlay, result) {
    const img = overlay.querySelector("#end-image");
    const isWin = result === "win";
    img.src = isWin ? "img/icons/win.png" : "img/icons/gameover.png";
    img.alt = isWin ? "You win" : "Game Over";
  }

  /**
   * Make the end overlay visible and accessible.
   * @param {HTMLElement} overlay
   */
  openEndOverlay(overlay) {
    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden", "false");
  }

  /**
   * Wire restart interactions (button/backdrop) to reload session.
   * @param {HTMLElement} overlay
   */
  bindRestart(overlay) {
    const restart = overlay.querySelector("#restart-btn");
    const backdrop = overlay.querySelector(".end-backdrop");
    const doRestart = () => {
      sessionStorage.setItem("AUTO_START", "1");
      location.reload();
    };
    restart?.addEventListener("click", doRestart);
    backdrop?.addEventListener("click", doRestart);
  }

  /** Hide all actors/HUD elements when showing the end overlay. */
  hideActors() {
    if (this.character) this.character.hidden = true;
    (this.level?.enemies || []).forEach((e) => (e.hidden = true));
    (this.bubbles || []).forEach((b) => (b.hidden = true));
    if (this.healthBar) this.healthBar.hidden = true;
    if (this.coinsBar) this.coinsBar.hidden = true;
    if (this.poisonBar) this.poisonBar.hidden = true;
  }
}
