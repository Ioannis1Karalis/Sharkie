/**
 * Final boss entity that manages its own finite-state behavior:
 * intro → swim → chase/attack → hurt/dead. Handles animations,
 * movement, collisions, and win-condition signaling.
 *
 * @extends MovableObject
 * @property {number} height                 - Visible height.
 * @property {number} width                  - Visible width.
 * @property {number} y                      - Initial vertical position.
 * @property {"hidden"|"intro"|"swim"|"chase"|"attack"|"hurt"|"dead"} state
 * @property {boolean} hidden                - Whether the boss is hidden.
 * @property {number} hitsLeft               - Remaining hits before death.
 * @property {boolean} entered               - Flag for entrance state.
 * @property {string[]} IMAGES_SWIMMING      - Swim/floating frames.
 * @property {string[]} IMAGES_INTRO         - Intro frames.
 * @property {string[]} IMAGES_ATTACK        - Attack frames.
 * @property {string[]} IMAGES_HURT          - Hurt frames.
 * @property {string[]} IMAGES_DEAD          - Death frames.
 */
class Endboss extends MovableObject {
  height = 600;
  width = 450;
  y = -160;

  state = "hidden";
  hidden = true;
  hitsLeft = 5;
  entered = false;

  IMAGES_SWIMMING = [
    "img/3.Enemy/3 Final Enemy/2.floating/1.png",
    "img/3.Enemy/3 Final Enemy/2.floating/2.png",
    "img/3.Enemy/3 Final Enemy/2.floating/3.png",
    "img/3.Enemy/3 Final Enemy/2.floating/4.png",
    "img/3.Enemy/3 Final Enemy/2.floating/5.png",
    "img/3.Enemy/3 Final Enemy/2.floating/6.png",
    "img/3.Enemy/3 Final Enemy/2.floating/7.png",
    "img/3.Enemy/3 Final Enemy/2.floating/8.png",
    "img/3.Enemy/3 Final Enemy/2.floating/9.png",
    "img/3.Enemy/3 Final Enemy/2.floating/10.png",
    "img/3.Enemy/3 Final Enemy/2.floating/11.png",
    "img/3.Enemy/3 Final Enemy/2.floating/12.png",
    "img/3.Enemy/3 Final Enemy/2.floating/13.png",
  ];

  IMAGES_INTRO = [
    "img/3.Enemy/3 Final Enemy/1.Introduce/1.png",
    "img/3.Enemy/3 Final Enemy/1.Introduce/2.png",
    "img/3.Enemy/3 Final Enemy/1.Introduce/3.png",
    "img/3.Enemy/3 Final Enemy/1.Introduce/4.png",
    "img/3.Enemy/3 Final Enemy/1.Introduce/5.png",
    "img/3.Enemy/3 Final Enemy/1.Introduce/6.png",
    "img/3.Enemy/3 Final Enemy/1.Introduce/7.png",
    "img/3.Enemy/3 Final Enemy/1.Introduce/8.png",
    "img/3.Enemy/3 Final Enemy/1.Introduce/9.png",
    "img/3.Enemy/3 Final Enemy/1.Introduce/10.png",
  ];

  IMAGES_ATTACK = [
    "img/3.Enemy/3 Final Enemy/Attack/1.png",
    "img/3.Enemy/3 Final Enemy/Attack/2.png",
    "img/3.Enemy/3 Final Enemy/Attack/3.png",
    "img/3.Enemy/3 Final Enemy/Attack/4.png",
    "img/3.Enemy/3 Final Enemy/Attack/5.png",
    "img/3.Enemy/3 Final Enemy/Attack/6.png",
  ];

  IMAGES_HURT = [
    "img/3.Enemy/3 Final Enemy/Hurt/1.png",
    "img/3.Enemy/3 Final Enemy/Hurt/2.png",
    "img/3.Enemy/3 Final Enemy/Hurt/3.png",
    "img/3.Enemy/3 Final Enemy/Hurt/4.png",
  ];

  IMAGES_DEAD = [
    "img/3.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2.png",
    "img/3.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 6.png",
    "img/3.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 7.png",
    "img/3.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 8.png",
    "img/3.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 9.png",
    "img/3.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 10.png",
  ];

  /**
   * Create and initialize the boss. Preloads animation sets and sets
   * collision offset and spawn position.
   */
  constructor() {
    super().loadImage("img/3.Enemy/3 Final Enemy/2.floating/1.png");
    this.loadImages(this.IMAGES_SWIMMING);
    this.loadImages(this.IMAGES_INTRO);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);

    this.offset = { top: 280, left: 10, right: 30, bottom: 100 };
    this.x = 4650;
    this.y = -160;
    this.otherDirection = false;
  }

  /**
   * Stop any running animation interval.
   * @private
   * @returns {void}
   */
  stopAnim() {
    if (this.animTimer) {
      clearInterval(this.animTimer);
      this.animTimer = null;
    }
  }

  /**
   * Play an animation in a continuous loop.
   * @param {string[]} frames - Image paths to loop through.
   * @param {number} intervalMs - Frame duration in milliseconds.
   * @returns {void}
   */
  playLoop(frames, intervalMs) {
    this.stopAnim();
    this.frameIndex = 0;
    this.img = this.imageCache[frames[0]];
    this.animTimer = setInterval(() => {
      this.img = this.imageCache[frames[this.frameIndex]];
      this.frameIndex = (this.frameIndex + 1) % frames.length;
    }, intervalMs);
  }

  /**
   * Play an animation exactly once, then invoke a callback.
   * @param {string[]} frames - Image paths to play in order.
   * @param {number} intervalMs - Frame duration in milliseconds.
   * @param {() => void} [onDone] - Called after the last frame.
   * @returns {void}
   */
  playOnce(frames, intervalMs, onDone) {
    this.stopAnim();
    this.frameIndex = 0;
    this.img = this.imageCache[frames[0]];
    this.animTimer = setInterval(() => {
      this.img = this.imageCache[frames[this.frameIndex]];
      this.frameIndex++;
      if (this.frameIndex >= frames.length) {
        clearInterval(this.animTimer);
        this.animTimer = null;
        if (onDone) onDone();
      }
    }, intervalMs);
  }

  /**
   * Begin the intro sequence if the boss is still hidden.
   * @returns {void}
   */
  startIntro() {
    if (this.state !== "hidden") return;
    this.hidden = false;
    this.state = "intro";
    this.playOnce(this.IMAGES_INTRO, 190, () => this.startSwim());
  }

  /**
   * Transition into the swim state, then to chase after one cycle.
   * @returns {void}
   */
  startSwim() {
    this.state = "swim";
    this.playOnce(this.IMAGES_SWIMMING, 130, () => this.startChase());
  }

  /**
   * Switch to the continuous chasing loop animation.
   * @returns {void}
   */
  startChase() {
    this.state = "chase";
    this.playLoop(this.IMAGES_SWIMMING, 130);
  }

  /**
   * Switch to the continuous attack loop animation.
   * @returns {void}
   */
  startAttack() {
    this.state = "attack";
    this.playLoop(this.IMAGES_ATTACK, 120);
  }

  /**
   * Apply damage to the boss; triggers hurt/death animations and
   * handles the win condition when health is depleted.
   * @returns {void}
   */
  takeHit() {
    if (this.state === "dead") return;
    this.hitsLeft = Math.max(0, this.hitsLeft - 1);
    this.world?.audio?.playHurt();

    if (this.hitsLeft === 0) {
      this.state = "dead";
      this.playOnce(this.IMAGES_DEAD, 200, () => {
        this.markForRemoval = true;
        this.world?.scheduleEndGame("win");
      });
    } else {
      this.state = "hurt";
      this.playOnce(this.IMAGES_HURT, 180, () => this.startChase());
    }
  }

  /**
   * Update boss orientation, state transitions, and movement toward
   * the character. Clamps vertical movement to world bounds.
   * @param {MovableObject} character - Player character to chase/attack.
   * @returns {void}
   */
  update(character) {
    if (
      this.state === "hidden" ||
      this.state === "intro" ||
      this.state === "hurt" ||
      this.state === "dead"
    )
      return;

    this.otherDirection = this.x < character.x;

    const dx = character.x - this.x;
    const dy = character.y - this.y;
    const dist = Math.hypot(dx, dy) || 1;
    const touching = this.isColliding(character);
    const attackRange = 220;

    if (touching || dist < attackRange) {
      if (this.state !== "attack") this.startAttack();
    } else if (this.state === "attack") {
      this.startSwim();
    }

    const speed = this.state === "attack" ? 2.1 : 1.4;
    this.x += (dx / dist) * speed;

    const targetY = character.y + (character.height - this.height) * 0.5;
    this.y += (targetY - this.y) * 0.04;

    const top = -360;
    const bottom = 270;
    if (this.y < top) this.y = top;
    if (this.y > bottom) this.y = bottom;
  }
}
