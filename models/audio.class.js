/**
 * Audio manager for Sharkie: handles background music and sound effects,
 * including global mute support and safe playback (with small try/catch guards).
 * Creates HTMLAudioElement instances for each asset and exposes simple helpers.
 *
 * Usage:
 *   window.audio.playBgm();
 *   window.audio.setMuted(true);
 *
 * Notes:
 * - When muted, BGM is paused and all SFX are prevented from playing.
 * - Coin/Poison SFX use a cloned node to allow overlapping playback.
 */
class AudioManager {
  /**
   * Creates audio elements for BGM and SFX and sets initial volumes.
   */
  constructor() {
    /** @type {HTMLAudioElement} */ this.bgm = new Audio(
      "audio/background-music.mp3"
    );
    this.bgm.loop = true;
    this.bgm.volume = 0.35;

    /** @type {HTMLAudioElement} */ this.sfxBubble = new Audio(
      "audio/bubble-attack.mp3"
    );
    this.sfxBubble.volume = 0.8;

    /** @type {HTMLAudioElement} */ this.sfxHurt = new Audio("audio/hurt.mp3");
    this.sfxHurt.volume = 0.9;

    /** @type {HTMLAudioElement} */ this.sfxCoin = new Audio("audio/coins.mp3");
    this.sfxCoin.volume = 0.9;

    /** @type {HTMLAudioElement} */ this.sfxPoison = new Audio(
      "audio/bottle.mp3"
    );
    this.sfxPoison.volume = 0.9;

    /** Whether all audio is muted. @type {boolean} */
    this.muted = false;
  }

  /**
   * Globally mute/unmute all sounds. Also pauses/resumes BGM accordingly.
   * @param {boolean} m - True to mute, false to unmute.
   */
  setMuted(m) {
    this.muted = !!m;
    const all = [
      this.bgm,
      this.sfxBubble,
      this.sfxHurt,
      this.sfxCoin,
      this.sfxPoison,
    ];
    all.forEach((a) => {
      try {
        a.muted = this.muted;
      } catch (_) {}
    });
    if (this.muted) {
      try {
        this.bgm.pause();
      } catch (_) {}
    } else {
      try {
        this.bgm.play();
      } catch (_) {}
    }
  }

  /**
   * Start background music from the beginning (respects mute flag).
   */
  playBgm() {
    if (this.muted) return;
    try {
      this.bgm.currentTime = 0;
      this.bgm.play();
    } catch (_) {}
  }

  /**
   * Pause background music (does not change the mute flag).
   */
  stopBgm() {
    try {
      this.bgm.pause();
    } catch (_) {}
  }

  /**
   * Play the bubble attack sound (single instance, respects mute flag).
   */
  playBubble() {
    if (this.muted) return;
    try {
      this.sfxBubble.currentTime = 0;
      this.sfxBubble.play();
    } catch (_) {}
  }

  /**
   * Play the generic hurt sound (single instance, respects mute flag).
   */
  playHurt() {
    if (this.muted) return;
    try {
      this.sfxHurt.currentTime = 0;
      this.sfxHurt.play();
    } catch (_) {}
  }

  /**
   * Play the coin pickup sound. Uses a cloned node for overlap.
   */
  playCoin() {
    if (this.muted) return;
    try {
      const a = this.sfxCoin.cloneNode();
      a.volume = this.sfxCoin.volume;
      a.muted = this.muted;
      a.play();
    } catch (_) {}
  }

  /**
   * Play the poison pickup sound. Uses a cloned node for overlap.
   */
  playPoison() {
    if (this.muted) return;
    try {
      const a = this.sfxPoison.cloneNode();
      a.volume = this.sfxPoison.volume;
      a.muted = this.muted;
      a.play();
    } catch (_) {}
  }
}

/** Global shared audio manager instance. @type {AudioManager} */
window.audio = window.audio || new AudioManager();