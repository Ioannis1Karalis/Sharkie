class PufferFishRed extends MovableObject {
    height = 90;
    width = 110;

    IMAGES_SWIMMING = [
        'img/3.Enemy/1.Puffer fish/1.Swim/3.swim1.png',
        'img/3.Enemy/1.Puffer fish/1.Swim/3.swim2.png',
        'img/3.Enemy/1.Puffer fish/1.Swim/3.swim3.png',
        'img/3.Enemy/1.Puffer fish/1.Swim/3.swim4.png',
        'img/3.Enemy/1.Puffer fish/1.Swim/3.swim5.png'
    ];

    IMAGES_TRANSITION = [
        'img/3.Enemy/1.Puffer fish/2.transition/3.transition1.png',
        'img/3.Enemy/1.Puffer fish/2.transition/3.transition2.png',
        'img/3.Enemy/1.Puffer fish/2.transition/3.transition3.png',
        'img/3.Enemy/1.Puffer fish/2.transition/3.transition4.png',
        'img/3.Enemy/1.Puffer fish/2.transition/3.transition5.png'
    ];

    IMAGES_BUBBLE = [
        'img/3.Enemy/1.Puffer fish/3.Bubbleeswim/3.bubbleswim1.png',
        'img/3.Enemy/1.Puffer fish/3.Bubbleeswim/3.bubbleswim2.png',
        'img/3.Enemy/1.Puffer fish/3.Bubbleeswim/3.bubbleswim3.png',
        'img/3.Enemy/1.Puffer fish/3.Bubbleeswim/3.bubbleswim4.png',
        'img/3.Enemy/1.Puffer fish/3.Bubbleeswim/3.bubbleswim5.png'
    ];

    IMAGES_DEAD = [
        'img/3.Enemy/1.Puffer fish/4.DIE/3.png',
        'img/3.Enemy/1.Puffer fish/4.DIE/3.3.png',
        'img/3.Enemy/1.Puffer fish/4.DIE/3.2.png'
    ];

    constructor(x, y) {
        super().loadImage(this.IMAGES_SWIMMING[0]);
        this.loadImages(this.IMAGES_SWIMMING);
        this.loadImages(this.IMAGES_TRANSITION);
        this.loadImages(this.IMAGES_BUBBLE);
        this.isDead = false;
        this.loadImages(this.IMAGES_DEAD);

        this.offset = {
            top: 0,
            left: 0,
            right: 0,
            bottom: 5
        };

        this.x = x || 550 + Math.random() * 500;
        this.y = y || 150 + Math.random() * 200;
        this.speed = 0.15 + Math.random() * 0.45;

        this.mode = "normal"; 
        this.startDelay = Math.random() * 5000;
        this.currentFrame = 0;

        this.animate();
    }

    animate() {
        this.moveLeft();
        setInterval(() => {
          if (this.isDead) return;
          if (this.mode == "normal")        this.playAnimation(this.IMAGES_SWIMMING);
          else if (this.mode == "transition") this.playTransitionAnimation();
          else if (this.mode == "bubble")      this.playAnimation(this.IMAGES_BUBBLE);
        }, 150);
    
        setTimeout(() => { this.startCycle(); }, this.startDelay);
      }
    

    startCycle() {
        this.mode = "normal";

        setTimeout(() => {
            this.startTransition();
        }, 4000 + Math.random() * 3000);
    }

    playTransitionAnimation() {
        if (this.isDead) return;
        if (!this.transitionStarted) {
          this.transitionStarted = true;
          this.currentFrame = 0;
          this.transitionInterval = setInterval(() => {
            if (this.isDead) { clearInterval(this.transitionInterval); return; }
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

    die() {
        if (this.isDead) return;
        this.isDead = true;
    
        this.speed = 0;
        if (this.transitionInterval) { clearInterval(this.transitionInterval); this.transitionInterval = null; }
    
        let i = 0;
        const frames = this.IMAGES_DEAD;
        const run = setInterval(() => {
          this.img = this.imageCache[frames[i]];
          i++;
          if (i >= frames.length) {
            clearInterval(run);
            let steps = 20;
            const floatUp = setInterval(() => {
              this.y -= 2;
              steps--;
              if (steps <= 0) {
                clearInterval(floatUp);
                this.markForRemoval = true;
              }
            }, 30);
          }
        }, 120);
    }

    startTransition() {
        this.mode = "transition";
    }

    startBubblePhase() {
        this.mode = "bubble";

        setTimeout(() => {
            this.mode = "normal";
            this.startCycle();
        }, 8000);
    }
}