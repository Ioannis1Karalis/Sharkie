class AudioManager {
  constructor() {
    this.bgm = new Audio("audio/background-music.mp3");
    this.bgm.loop = true;
    this.bgm.volume = 0.35;

    this.sfxBubble = new Audio("audio/bubble-attack.mp3");
    this.sfxBubble.volume = 0.8;

    this.sfxHurt = new Audio("audio/hurt.mp3");
    this.sfxHurt.volume = 0.9;

    this.sfxCoin = new Audio("audio/coins.mp3");
    this.sfxCoin.volume = 0.9;

    this.sfxPoison = new Audio("audio/bottle.mp3");
    this.sfxPoison.volume = 0.9;

    this.muted = false;
  }

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

  playBgm() {
    if (this.muted) return;
    try {
      this.bgm.currentTime = 0;
      this.bgm.play();
    } catch (_) {}
  }
  stopBgm() {
    try {
      this.bgm.pause();
    } catch (_) {}
  }

  playBubble() {
    if (this.muted) return;
    try {
      this.sfxBubble.currentTime = 0;
      this.sfxBubble.play();
    } catch (_) {}
  }
  playHurt() {
    if (this.muted) return;
    try {
      this.sfxHurt.currentTime = 0;
      this.sfxHurt.play();
    } catch (_) {}
  }

  playCoin() {
    if (this.muted) return;
    try {
      const a = this.sfxCoin.cloneNode();
      a.volume = this.sfxCoin.volume;
      a.muted = this.muted;
      a.play();
    } catch (_) {}
  }

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
window.__audio = window.__audio || new AudioManager();