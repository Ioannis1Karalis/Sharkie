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
  
    const muted = getMuted();
    window.audio?.setMuted(muted);
    if (!muted) { window.audio?.playBgm(); }
  
    syncAudioButton(); 
}
  function syncAudioButton() {
    const btn = document.querySelector("[data-audio-toggle]");
    if (!btn) return;
    updateAudioBtn(btn, getMuted());
  }
  
  window.bgLoader = {
    pending: 0,
    started: false,
    start() { this.started = true; if (typeof showLoader === 'function') showLoader(); },
    track(img) {
      if (!img) return;
      this.pending++;
      const done = () => {
        img.removeEventListener('load', done);
        img.removeEventListener('error', done);
        if (--this.pending <= 0 && this.started) {
          if (typeof hideLoader === 'function') hideLoader(0);
          document.getElementById('game-container')?.classList.add('started');
        }
      };
      // Falls aus dem Cache schon fertig:
      if (img.complete && img.naturalWidth > 0) { done(); return; }
      img.addEventListener('load', done);
      img.addEventListener('error', done);
    }
  };
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
    const btn = document.querySelector('[data-audio-toggle]');
    if (!btn) return;
    btn.style.pointerEvents = "auto";
    btn.addEventListener("click", () => {
      const muted = !getMuted();
      setMuted(muted);
      updateAudioBtn(btn, muted);
  
      // ← Neu: Wenn gerade auf "Sound an" gewechselt wurde, Musik starten
      if (!muted) { try { (window.audio || window.world?.audio)?.playBgm(); } catch {} }
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
      
      window.bgLoader?.start();
      init();
      if (world) {
        world.onFirstFrame = () => {
          hideLoader(1200);
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
  if (e.keyCode == 70) keyboard.F = true;
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
  if (e.keyCode == 70) keyboard.F = false;
});

/**
 * Updates the "rotate device" overlay based on device/orientation.
 * - Shows overlay on mobile portrait, hides otherwise.
 * - Stops/starts BGM accordingly (respects persisted mute flag).
 *
 * Side effects: toggles aria-hidden and calls audio methods inside try/catch.
 * @returns {void}
 */
function updateRotateOverlay(){
    const overlay = document.getElementById('rotate-overlay');
    if (!overlay) return;
  
    const isMobile   = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const isPortrait = window.matchMedia('(orientation: portrait)').matches;
  
    const show = isMobile && isPortrait;
    overlay.setAttribute('aria-hidden', String(!show));
  
    try {
      if (show) window.audio?.stopBgm?.();
      else if (localStorage.getItem('AUDIO_MUTED')!=='1') window.audio?.playBgm?.();
    } catch {}
  }
  
  /**
   * Returns the active Keyboard instance used by the game.
   * Tries window.keyboard, then window.world.keyboard, then global `keyboard`.
   * @returns {Keyboard|null}
   */
  function tcGetKb() {
    return window.keyboard || window.world?.keyboard
      || (typeof keyboard !== 'undefined' ? keyboard : null);
  }
  
  /**
   * Sets a key flag on the active Keyboard instance.
   * @param {'UP'|'DOWN'|'LEFT'|'RIGHT'|'SPACE'|'D'|'F'} key - Logical key name.
   * @param {boolean} val - Desired pressed state.
   * @returns {void}
   */
  function tcSetKey(key, val) {
    const k = tcGetKb();
    if (k && key in k) k[key] = !!val;
  }
  
  /**
   * Binds press-and-hold semantics to a button using Pointer Events.
   * Prevents scrolling/selection; sets/releases key on down/up/cancel/leave.
   * @param {HTMLElement} el - The button element to bind.
   * @param {'UP'|'DOWN'|'LEFT'|'RIGHT'|'SPACE'|'D'|'F'} key - Keyboard flag to drive.
   * @returns {void}
   */
  function tcBindHold(el, key) {
    const down = (e) => { e.preventDefault(); try{el.setPointerCapture?.(e.pointerId);}catch{} tcSetKey(key,true); };
    const up   = (e) => { e.preventDefault(); try{el.releasePointerCapture?.(e.pointerId);}catch{} tcSetKey(key,false); };
    el.addEventListener('pointerdown', down, { passive:false });
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('pointerleave', up);
  }
  
  /**
   * Releases all touch-control keys (safety on pointerup/cancel/blur/hidden).
   * @returns {void}
   */
  function tcReleaseAll() {
    ['UP','DOWN','LEFT','RIGHT','SPACE','D'].forEach(k => tcSetKey(k,false));
  }
  
  /**
   * Decides whether touch controls should be visible.
   * Visible when: landscape + coarse pointer + game started + rotate overlay hidden.
   * @returns {boolean}
   */
  function tcShouldShow() {
    const mql = window.matchMedia('(orientation: landscape) and (hover: none) and (pointer: coarse)');
    const started = document.getElementById('game-container')?.classList.contains('started')
                 || document.getElementById('start-overlay')?.classList.contains('hide');
    const rotateShown = document.getElementById('rotate-overlay')?.classList.contains('show');
    return mql.matches && started && !rotateShown;
  }
  
  /**
   * Applies the current visibility to the #touch-controls element.
   * @returns {void}
   */
  function tcUpdate() {
    const tc = document.getElementById('touch-controls');
    if (!tc) return;
    tc.hidden = !tcShouldShow();
  }
  
  /**
   * Subscribes to orientation/resize and 'started' class changes to recompute visibility.
   * @returns {void}
   */
  function tcWireObservers() {
    const startedEl = document.getElementById('game-container');
    const mql = window.matchMedia('(orientation: landscape) and (hover: none) and (pointer: coarse)');
    mql.addEventListener('change', tcUpdate);
    window.addEventListener('resize', tcUpdate);
    if (startedEl) new MutationObserver(tcUpdate).observe(startedEl,{attributes:true,attributeFilter:['class']});
  }
  
  /**
   * Wires global releases so keys don't get stuck.
   * Adds pointerup/cancel/blur/visibilitychange handlers and disables context menu.
   * @param {HTMLElement} tc - The root touch-controls container.
   * @returns {void}
   */
  function tcWireGlobalReleases(tc) {
    window.addEventListener('pointerup', tcReleaseAll);
    window.addEventListener('pointercancel', tcReleaseAll);
    window.addEventListener('blur', tcReleaseAll);
    document.addEventListener('visibilitychange', () => { if (document.hidden) tcReleaseAll(); });
    tc.addEventListener('contextmenu', e => e.preventDefault());
  }
  
  /**
   * Binds hold behavior to all buttons inside the touch-controls container.
   * @param {HTMLElement} tc - The root touch-controls container.
   * @returns {void}
   */
  function tcWireButtons(tc) {
    tc.querySelectorAll('[data-key]').forEach(btn => tcBindHold(btn, btn.dataset.key));
  }
  
  /**
   * Initializes the mobile touch controls (wiring, observers, visibility).
   * Safe no-op when #touch-controls is missing.
   * @returns {void}
   */
  function initTouchControls() {
    const tc = document.getElementById('touch-controls');
    if (!tc) return;
    tcWireButtons(tc);
    tcWireObservers();
    tcWireGlobalReleases(tc);
    tcUpdate();
  }
  
  /**
   * Restarts the game in-place without reloading the page or showing the start screen.
   * Hides start overlay, calls init(), ensures .started class is set on #game-container.
   * @returns {void}
   */
  function resetGameInPlace() {
    const startLayer = document.getElementById("start-overlay");
    startLayer?.classList.add("hide");
    startLayer?.setAttribute("aria-hidden", "true");
  
    init();
  
    document.getElementById("game-container")?.classList.add("started");
  }