class PufferFishGreen extends MovableObject {
    height = 90;
    width = 110;

    IMAGES_SWIMMING = [
        'img/3.Enemy/1.Puffer fish/1.Swim/1.swim1.png',
        'img/3.Enemy/1.Puffer fish/1.Swim/1.swim2.png',
        'img/3.Enemy/1.Puffer fish/1.Swim/1.swim3.png',
        'img/3.Enemy/1.Puffer fish/1.Swim/1.swim4.png',
        'img/3.Enemy/1.Puffer fish/1.Swim/1.swim5.png',

    ];

    IMAGES_TRANSITION = [
        'img/3.Enemy/1.Puffer fish/2.transition/1.transition1.png',
        'img/3.Enemy/1.Puffer fish/2.transition/1.transition2.png',
        'img/3.Enemy/1.Puffer fish/2.transition/1.transition3.png',
        'img/3.Enemy/1.Puffer fish/2.transition/1.transition4.png',
        'img/3.Enemy/1.Puffer fish/2.transition/1.transition5.png'
    ];

    IMAGES_BUBBLE = [
        'img/3.Enemy/1.Puffer fish/3.Bubbleeswim/1.bubbleswim1.png',
        'img/3.Enemy/1.Puffer fish/3.Bubbleeswim/1.bubbleswim2.png',
        'img/3.Enemy/1.Puffer fish/3.Bubbleeswim/1.bubbleswim3.png',
        'img/3.Enemy/1.Puffer fish/3.Bubbleeswim/1.bubbleswim4.png',
        'img/3.Enemy/1.Puffer fish/3.Bubbleeswim/1.bubbleswim5.png'
    ];

    IMAGES_DEAD = [
        'img/3.Enemy/1.Puffer fish/4.DIE/1.Dead 1 (can animate by going up).png',
        'img/3.Enemy/1.Puffer fish/4.DIE/1.Dead 2 (can animate by going down to the floor after the Fin Slap attack).png',
        'img/3.Enemy/1.Puffer fish/4.DIE/1.Dead 3 (can animate by going down to the floor after the Fin Slap attack).png'
    ];

    constructor(x, y) {
        super().loadImage(this.IMAGES_SWIMMING[0]);
        this.loadImages(this.IMAGES_SWIMMING);
        this.loadImages(this.IMAGES_TRANSITION);
        this.loadImages(this.IMAGES_BUBBLE);

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
            if (this.mode == "normal") {
                this.playAnimation(this.IMAGES_SWIMMING);
            } else if (this.mode == "transition") {
                this.playTransitionAnimation();
            } else if (this.mode == "bubble") {
                this.playAnimation(this.IMAGES_BUBBLE);
            }
        }, 150);

        setTimeout(() => {
            this.startCycle();
        }, this.startDelay);
    }

    startCycle() {
        this.mode = "normal";

        setTimeout(() => {
            this.startTransition();
        }, 4000 + Math.random() * 3000);
    }

    playTransitionAnimation() {
        if (!this.transitionStarted) {
            this.transitionStarted = true;
            this.currentFrame = 0;

            this.transitionInterval = setInterval(() => {
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