let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById('canvas');
    window.level1 = createLevel1();
    world = new World(canvas, keyboard);
}

document.addEventListener('DOMContentLoaded', () => {
    const canvasEl = document.getElementById('canvas');
    const fsBtn    = document.getElementById('fs-btn');
    if (fsBtn && canvasEl && canvasEl.requestFullscreen) {
      fsBtn.addEventListener('click', () => canvasEl.requestFullscreen());
    }
  
    const startOverlay = document.getElementById('start-overlay');
    const startBtn     = document.getElementById('start-btn-img');
  
    // Einheitliche Startfunktion
    const startGame = () => {
      startOverlay?.remove();
      document.getElementById('game-container')?.classList.add('started');
      init(); // baut Level und World und startet die Loops
    };
  
    // Normaler Start-Button
    if (startBtn) startBtn.addEventListener('click', startGame);
  
    // Nach Restart automatisch starten (Start-Screen überspringen)
    if (sessionStorage.getItem('AUTO_START') === '1') {
      sessionStorage.removeItem('AUTO_START');
      startGame();
    }
  });

function initInfoModal() {
    const infoBtn = document.getElementById('info-btn-img');
    const modal   = document.getElementById('info-modal');
    if (!infoBtn || !modal) {
      if (!infoBtn) console.warn('#info-btn-img nicht gefunden – Info-Button wird nicht verdrahtet.');
      if (!modal)   console.warn('#info-modal nicht gefunden – Info-Overlay existiert nicht im DOM.');
      return;
    }
  
    const backdrop = modal.querySelector('.modal-backdrop');
    const content  = modal.querySelector('.modal-content');
  
    const open  = () => { modal.classList.add('show');  modal.setAttribute('aria-hidden', 'false'); };
    const close = () => { modal.classList.remove('show'); modal.setAttribute('aria-hidden', 'true'); };
  
    infoBtn.addEventListener('click', open);
    if (backdrop) backdrop.addEventListener('click', close);
    if (content) content.addEventListener('click', (e) => e.stopPropagation());
}
  

window.addEventListener("keydown", (e) => {
    if(e.keyCode == 39) {
        keyboard.RIGHT = true;
    }

    if(e.keyCode == 37) {
        keyboard.LEFT = true;
    }

    if(e.keyCode == 38) {
        keyboard.UP = true;
    }

    if(e.keyCode == 40) {
        keyboard.DOWN = true;
    }

    if(e.keyCode == 32) {
        keyboard.SPACE = true;
    }

    if(e.keyCode == 68) {
        keyboard.D = true;
    }

    console.log(e);
})

window.addEventListener("keyup", (e) => {
    if(e.keyCode == 39) {
        keyboard.RIGHT = false;
    }

    if(e.keyCode == 37) {
        keyboard.LEFT = false;
    }

    if(e.keyCode == 38) {
        keyboard.UP = false;
    }

    if(e.keyCode == 40) {
        keyboard.DOWN = false;
    }

    if(e.keyCode == 32) {
        keyboard.SPACE = false;
    }

    if(e.keyCode == 68) {
        keyboard.D = false;
    }

    console.log(e);
})