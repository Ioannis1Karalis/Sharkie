/** @type {HTMLCanvasElement|null} Canvas element used for rendering. */
let canvas;
/** @type {World|undefined} Game world instance (created in init). */
let world;
/** @type {Keyboard} Global keyboard input handler. */
let keyboard = new Keyboard();
/** @type {number} Timestamp when the loader was shown (for minimum display time). */
let loaderShownAt = 0;
/** @constant {string} LocalStorage key for the global mute setting. */
const MUTE_KEY = "AUDIO_MUTED";

/**
 * Bootstraps the game:
 * - Resolves canvas
 * - Builds level and world
 * - Syncs audio toggle UI and state
 * - Starts background music if not muted
 */
function init() {
  canvas = document.getElementById("canvas");
  window.level1 = createLevel1();
  world = new World(canvas, keyboard);

  syncAudioButton();
  const am = window.world?.audio;
  if (am && !am.muted) {
    try {
      am.playBgm();
    } catch {}
  }
}

/**
 * Returns whether audio is currently muted (from LocalStorage).
 * @returns {boolean} True if muted, else false.
 */
function getMuted() {
  return localStorage.getItem(MUTE_KEY) === "1";
}

/**
 * Persists mute state and forwards it to the global audio manager (if present).
 * @param {boolean} m - Desired mute state.
 * @returns {void}
 */
function setMuted(m) {
  localStorage.setItem(MUTE_KEY, m ? "1" : "0");
  window.audio?.setMuted(!!m);
}

/**
 * Updates the audio toggle button’s icon and alt text.
 * @param {HTMLImageElement} btn - The <img> element that toggles audio.
 * @param {boolean} muted - Current mute state.
 * @returns {void}
 */
function updateAudioBtn(btn, muted) {
  const on = btn.dataset.soundOn || "img/icons/sound-on.png";
  const off = btn.dataset.soundOff || "img/icons/mute.png";
  btn.src = muted ? off : on;
  btn.alt = muted ? "Sound off" : "Sound on";
}

/**
 * Synchronizes the audio toggle button and applies the persisted mute state
 * to the global audio manager, if available.
 * @returns {void}
 */
function syncAudioButton() {
  const btn = document.querySelector("[data-audio-toggle]");
  if (!btn) return;
  const muted = getMuted();
  updateAudioBtn(btn, muted);
  window.audio?.setMuted(muted);
}

/**
 * Wires the click handler for the audio toggle button and enables pointer events.
 * @returns {void}
 */
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

/**
 * Pauses/resumes background music when the page/tab visibility changes.
 * Respects the persisted mute setting.
 */
document.addEventListener("visibilitychange", () => {
  if (!window.audio) return;
  const muted = localStorage.getItem("AUDIO_MUTED") === "1";
  if (document.hidden) window.audio.stopBgm();
  else if (!muted) window.audio.playBgm();
});

/**
 * Initial DOM wiring for the audio button and initial icon/state sync.
 */
document.addEventListener("DOMContentLoaded", () => {
  wireAudioButton();
  syncAudioButton();
});

/**
 * Shows the loading overlay and records the start time (for minimum display time).
 * @returns {void}
 */
function showLoader() {
  const el = document.getElementById("loading-overlay");
  if (!el) return;
  loaderShownAt = performance.now();
  el.classList.add("show");
  el.setAttribute("aria-hidden", "false");
}

/**
 * Hides the loading overlay, ensuring a minimum visible duration.
 * @param {number} [minMs=250] - Minimum time (ms) the loader should remain visible.
 * @returns {void}
 */
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

/**
 * DOM ready: wires Fullscreen, Info modal, Start overlay and loader, and
 * starts the game on click. Hides loader on first render frame.
 */
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

/**
 * Initializes the info modal (open/close handlers and backdrop behavior).
 * No-ops if required elements do not exist.
 * @returns {void}
 */
function initInfoModal() {
  const btn = document.getElementById("info-btn-img");
  const modal = document.getElementById("info-modal");
  if (!btn || !modal) return;

  const backdrop = modal.querySelector(".modal-backdrop");
  const content = modal.querySelector(".modal-content");

  /** Opens the info modal. */
  const openModal = () => {
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  };
  /** Closes the info modal. */
  const closeModal = () => {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  };

  btn.addEventListener("click", openModal);
  backdrop?.addEventListener("click", closeModal);
  content?.addEventListener("click", (e) => e.stopPropagation());
}

/**
 * Global keydown handler: sets keyboard state flags for movement/attack.
 */
window.addEventListener("keydown", (e) => {
  if (e.keyCode == 39) keyboard.RIGHT = true;
  if (e.keyCode == 37) keyboard.LEFT = true;
  if (e.keyCode == 38) keyboard.UP = true;
  if (e.keyCode == 40) keyboard.DOWN = true;
  if (e.keyCode == 32) keyboard.SPACE = true;
  if (e.keyCode == 68) keyboard.D = true;
});

/**
 * Global keyup handler: clears keyboard state flags for movement/attack.
 */
window.addEventListener("keyup", (e) => {
  if (e.keyCode == 39) keyboard.RIGHT = false;
  if (e.keyCode == 37) keyboard.LEFT = false;
  if (e.keyCode == 38) keyboard.UP = false;
  if (e.keyCode == 40) keyboard.DOWN = false;
  if (e.keyCode == 32) keyboard.SPACE = false;
  if (e.keyCode == 68) keyboard.D = false;
});