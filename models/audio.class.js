class AudioManager {
  constructor() {
    // Musik
    this.bgm = new Audio("audio/background-music.mp3");
    this.bgm.loop = true;
    this.bgm.volume = 0.35;

    // SFX
    this.sfxBubble = new Audio("audio/bubble-attack.mp3");
    this.sfxBubble.volume = 0.8;

    this.sfxHurt = new Audio("audio/hurt.mp3");
    this.sfxHurt.volume = 0.9;

    this.sfxCoin = new Audio("audio/coins.mp3"); // Pfad/Name bei dir ggf. anpassen
    this.sfxCoin.volume = 0.9;

    this.sfxPoison = new Audio("audio/bottle.mp3"); // Pfad/Name bei dir ggf. anpassen
    this.sfxPoison.volume = 0.9;
  }

  playBgm() {
    try {
      this.bgm.currentTime = 0;
      this.bgm.play();
    } catch (e) {}
  }
  stopBgm() {
    try {
      this.bgm.pause();
    } catch (e) {}
  }
  playBubble() {
    try {
      this.sfxBubble.currentTime = 0;
      this.sfxBubble.play();
    } catch (e) {}
  }
  playHurt() {
    try {
      this.sfxHurt.currentTime = 0;
      this.sfxHurt.play();
    } catch (e) {}
  }

  // NEU: bei schnellen Serien wird geklont, damit sich Sounds nicht abschneiden
  playCoin() {
    try {
      const a = this.sfxCoin.cloneNode();
      a.volume = this.sfxCoin.volume;
      a.play();
    } catch (e) {}
  }
  playPoison() {
    try {
      const a = this.sfxPoison.cloneNode();
      a.volume = this.sfxPoison.volume;
      a.play();
    } catch (e) {}
  }
}
