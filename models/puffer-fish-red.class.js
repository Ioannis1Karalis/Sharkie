/**
 * Red pufferfish enemy with three behavior phases:
 * normal swim → transition inflate → bubble (inflated) swim.
 * Includes a death animation that floats upward before removal.
 *
 * @extends MovableObject
 *
 * @property {number} height Sprite height in px.
 * @property {number} width  Sprite width in px.
 * @property {string[]} IMAGES_SWIMMING Frames for normal swimming loop.
 * @property {string[]} IMAGES_TRANSITION Frames for inflate/deflate transition (played once).
 * @property {string[]} IMAGES_BUBBLE Frames for inflated bubble-swim loop.
 * @property {string[]} IMAGES_DEAD Frames for death sequence.
 * @property {boolean} isDead Whether the fish is dead (halts behavior).
 * @property {{top:number,left:number,right:number,bottom:number}} offset Hitbox padding.
 * @property {number} x World X position.
 * @property {number} y World Y position.
 * @property {number} speed Horizontal movement speed (px per tick).
 * @property {"normal"|"transition"|"bubble"} mode Current behavior mode.
 * @property {number} startDelay Randomized delay before first behavior cycle.
 * @property {number} currentFrame Local frame index used in transition playback.
 * @property {boolean} transitionStarted Internal guard to avoid overlapping transitions.
 * @property {number|undefined} transitionInterval Interval id for transition animation.
 */
class PufferFishRed extends MovableObject {
  height = 90;
  width = 110;

  IMAGES_SWIMMING = [
    "img/3.Enemy/1.Puffer fish/1.Swim/3.swim1.png",
    "img/3.Enemy/1.Puffer fish/1.Swim/3.swim2.png",
    "img/3.Enemy/1.Puffer fish/1.Swim/3.swim3.png",
    "img/3.Enemy/1.Puffer fish/1.Swim/3.swim4.png",
    "img/3.Enemy/1.Puffer fish/1.Swim/3.swim5.png",
  ];

  IMAGES_TRANSITION = [
    "img/3.Enemy/1.Puffer fish/2.transition/3.transition1.png",
    "img/3.Enemy/1.Puffer fish/2.transition/3.transition2.png",
    "img/3.Enemy/1.Puffer fish/2.transition/3.transition3.png",
    "img/3.Enemy/1.Puffer fish/2.transition/3.transition4.png",
    "img/3.Enemy/1.Puffer fish/2.transition/3.transition5.png",
  ];

  IMAGES_BUBBLE = [
    "img/3.Enemy/1.Puffer fish/3.Bubbleeswim/3.bubbleswim1.png",
    "img/3.Enemy/1.Puffer fish/3.Bubbleeswim/3.bubbleswim2.png",
    "img/3.Enemy/1.Puffer fish/3.Bubbleeswim/3.bubbleswim3.png",
    "img/3.Enemy/1.Puffer fish/3.Bubbleeswim/3.bubbleswim4.png",
    "img/3.Enemy/1.Puffer fish/3.Bubbleeswim/3.bubbleswim5.png",
  ];

  IMAGES_DEAD = [
    "img/3.Enemy/1.Puffer fish/4.DIE/3.png",
    "img/3.Enemy/1.Puffer fish/4.DIE/3.3.png",
    "img/3.Enemy/1.Puffer fish/4.DIE/3.2.png",
  ];

  /**
   * @param {number} [x] Optional start X (defaults to 550–1050 random range)
   * @param {number} [y] Optional start Y (defaults to 150–350 random range)
   */
  constructor(x, y) {
    super().loadImage(this.IMAGES_SWIMMING[0]);
    this.loadImages(this.IMAGES_SWIMMING);
    this.loadImages(this.IMAGES_TRANSITION);
    this.loadImages(this.IMAGES_BUBBLE);
    this.isDead = false;
    this.loadImages(this.IMAGES_DEAD);

    this.offset = { top: 0, left: 0, right: 0, bottom: 5 };

    this.x = x || 550 + Math.random() * 500;
    this.y = y || 150 + Math.random() * 200;
    this.speed = 0.15 + Math.random() * 0.45;

    this.mode = "normal";
    this.startDelay = Math.random() * 5000;
    this.currentFrame = 0;

    this.animate();
  }

  /**
   * Kicks off movement and looping animations; schedules the phase cycle.
   * Movement is a constant leftward drift; animation depends on {@link mode}.
   */
  animate() {
    this.moveLeft();
    setInterval(() => {
      if (this.isDead) return;
      if (this.mode == "normal") this.playAnimation(this.IMAGES_SWIMMING);
      else if (this.mode == "transition") this.playTransitionAnimation();
      else if (this.mode == "bubble") this.playAnimation(this.IMAGES_BUBBLE);
    }, 150);

    setTimeout(() => {
      this.startCycle();
    }, this.startDelay);
  }

  /**
   * Starts the repeating behavior cycle: normal → transition → bubble → normal.
   * Uses randomized delay to desync multiple enemies.
   */
  startCycle() {
    this.mode = "normal";
    setTimeout(() => {
      this.startTransition();
    }, 4000 + Math.random() * 3000);
  }

  /**
   * Plays the one-shot transition animation, then enters the bubble phase.
   * Guarded to prevent multiple concurrent transition timers.
   */
  playTransitionAnimation() {
    if (this.isDead) return;
    if (!this.transitionStarted) {
      this.transitionStarted = true;
      this.currentFrame = 0;
      this.transitionInterval = setInterval(() => {
        if (this.isDead) {
          clearInterval(this.transitionInterval);
          return;
        }
        this.img = this.imageCache[this.IMAGES_TRANSITION[this.currentFrame]];
        this.currentFrame++;
        if (this.currentFrame >= this.IMAGES_TRANSITION.length) {
          clearInterval(this.transitionInterval);
          this.transitionStarted = false;
          this.startBubblePhase();
        }
      }, 150);
    }
  }

  /**
   * Triggers death sequence: stops behavior, runs death frames, then floats up
   * before marking the sprite for removal.
   */
  die() {
    if (this.isDead) return;
    this.isDead = true;
    this.world?.audio?.playHurt();

    this.speed = 0;
    if (this.transitionInterval) {
      clearInterval(this.transitionInterval);
      this.transitionInterval = null;
    }

    let i = 0;
    const frames = this.IMAGES_DEAD;
    const run = setInterval(() => {
      this.img = this.imageCache[frames[i]];
      i++;
      if (i >= frames.length) {
        clearInterval(run);

        const stepPx = 5,
          intervalMs = 16;
        let steps = 36;
        const floatUp = setInterval(() => {
          this.y -= stepPx;
          if (--steps <= 0) {
            clearInterval(floatUp);
            this.markForRemoval = true;
          }
        }, intervalMs);
      }
    }, 120);
  }

  /** Enters the transition (inflate) phase. */
  startTransition() {
    this.mode = "transition";
  }

  /**
   * Enters the bubble (inflated) phase; after 8s, returns to normal and restarts cycle.
   */
  startBubblePhase() {
    this.mode = "bubble";
    setTimeout(() => {
      this.mode = "normal";
      this.startCycle();
    }, 8000);
  }
}