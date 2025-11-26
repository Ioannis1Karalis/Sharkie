let canvas;
let world;
let keyboard = new Keyboard();
let loaderShownAt = 0;

function init() {
  canvas = document.getElementById("canvas");
  window.level1 = createLevel1();
  world = new World(canvas, keyboard);

  syncAudioButton();
  if (!window.__audio?.muted) {
    try {
      window.__audio.playBgm();
    } catch (_) {}
  }
}

const MUTE_KEY = "AUDIO_MUTED";

function getMuted() {
  return localStorage.getItem(MUTE_KEY) === "1";
}

function setMuted(m) {
  localStorage.setItem(MUTE_KEY, m ? "1" : "0");
  window.__audio?.setMuted(!!m);
}

function updateAudioBtn(btn, muted) {
  const on = btn.dataset.soundOn || "img/icons/sound-on.png";
  const off = btn.dataset.soundOff || "img/icons/mute.png";
  btn.src = muted ? off : on;
  btn.alt = muted ? "Sound off" : "Sound on";
}

function syncAudioButton() {
  const btn = document.querySelector("[data-audio-toggle]");
  if (!btn) return;
  const muted = getMuted();
  updateAudioBtn(btn, muted);
  window.__audio?.setMuted(muted);
}

function wireAudioButton() {
  const btn = document.querySelector("[data-audio-toggle]");
  if (!btn) return;
  btn.style.pointerEvents = "auto";
  btn.addEventListener("click", () => {
    const muted = !getMuted();
    setMuted(muted);
    updateAudioBtn(btn, muted);
  });
}

document.addEventListener('visibilitychange', ()=>{
    if (!window.__audio) return;
    const muted = localStorage.getItem('AUDIO_MUTED')==='1';
    if (document.hidden) window.__audio.stopBgm();
    else if (!muted) window.__audio.playBgm();
  });

document.addEventListener("DOMContentLoaded", () => {
  wireAudioButton();
  syncAudioButton();
});

function showLoader() {
  const el = document.getElementById("loading-overlay");
  if (!el) return;
  loaderShownAt = performance.now();
  el.classList.add("show");
  el.setAttribute("aria-hidden", "false");
}

function hideLoader(minMs = 250) {
  const el = document.getElementById("loading-overlay");
  if (!el) return;
  const elapsed = performance.now() - loaderShownAt;
  const wait = Math.max(0, minMs - elapsed);
  setTimeout(() => {
    el.classList.remove("show");
    el.setAttribute("aria-hidden", "true");
  }, wait);
}

document.addEventListener("DOMContentLoaded", () => {
  const canvasEl = document.getElementById("canvas");
  const btnFs = document.getElementById("fs-btn");
  if (btnFs && canvasEl && canvasEl.requestFullscreen) {
    btnFs.addEventListener("click", () => canvasEl.requestFullscreen());
  }
  if (typeof initInfoModal === "function") {
    initInfoModal();
  }
  const startLayer = document.getElementById("start-overlay");
  const startBtn = document.getElementById("start-btn-img");

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      startLayer?.classList.add("hide");
      startLayer?.setAttribute("aria-hidden", "true");

      if (typeof showLoader === "function") showLoader();
      init();
      if (world) {
        world.onFirstFrame = () => {
          hideLoader();
          document.getElementById("game-container")?.classList.add("started");
        };
      }
    });
  }
});

function initInfoModal() {
  const infoBtn = document.getElementById("info-btn-img");
  const modal = document.getElementById("info-modal");
  if (!infoBtn || !modal) {
    if (!infoBtn)
      console.warn(
        "#info-btn-img nicht gefunden – Info-Button wird nicht verdrahtet."
      );
    if (!modal)
      console.warn(
        "#info-modal nicht gefunden – Info-Overlay existiert nicht im DOM."
      );
    return;
  }

  const backdrop = modal.querySelector(".modal-backdrop");
  const content = modal.querySelector(".modal-content");

  const open = () => {
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  };
  const close = () => {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  };

  infoBtn.addEventListener("click", open);
  if (backdrop) backdrop.addEventListener("click", close);
  if (content) content.addEventListener("click", (e) => e.stopPropagation());
}

window.addEventListener("keydown", (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = true;
  }

  if (e.keyCode == 37) {
    keyboard.LEFT = true;
  }

  if (e.keyCode == 38) {
    keyboard.UP = true;
  }

  if (e.keyCode == 40) {
    keyboard.DOWN = true;
  }

  if (e.keyCode == 32) {
    keyboard.SPACE = true;
  }

  if (e.keyCode == 68) {
    keyboard.D = true;
  }

  console.log(e);
});

window.addEventListener("keyup", (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = false;
  }

  if (e.keyCode == 37) {
    keyboard.LEFT = false;
  }

  if (e.keyCode == 38) {
    keyboard.UP = false;
  }

  if (e.keyCode == 40) {
    keyboard.DOWN = false;
  }

  if (e.keyCode == 32) {
    keyboard.SPACE = false;
  }

  if (e.keyCode == 68) {
    keyboard.D = false;
  }

  console.log(e);
});
