class Character extends MovableObject{

    height = 300;
    width = 250;
    y = 40;
    x = 10;
    speed = 10;
    idleTime = 0;
    sleepThreshold = 4000;

    IMAGES_REGULAR = [
        'img/2.Sharkie/1.IDLE/1.png',
        'img/2.Sharkie/1.IDLE/2.png',
        'img/2.Sharkie/1.IDLE/3.png',
        'img/2.Sharkie/1.IDLE/4.png',
        'img/2.Sharkie/1.IDLE/5.png',
        'img/2.Sharkie/1.IDLE/6.png',
        'img/2.Sharkie/1.IDLE/7.png',
        'img/2.Sharkie/1.IDLE/8.png',
        'img/2.Sharkie/1.IDLE/9.png',
        'img/2.Sharkie/1.IDLE/10.png',
        'img/2.Sharkie/1.IDLE/11.png',
        'img/2.Sharkie/1.IDLE/12.png',
        'img/2.Sharkie/1.IDLE/13.png',
        'img/2.Sharkie/1.IDLE/14.png',
        'img/2.Sharkie/1.IDLE/15.png',
        'img/2.Sharkie/1.IDLE/16.png',
        'img/2.Sharkie/1.IDLE/17.png',
        'img/2.Sharkie/1.IDLE/18.png'
    ];

    IMAGES_SWIMMING = [
        'img/2.Sharkie/3.Swim/1.png',
        'img/2.Sharkie/3.Swim/2.png',
        'img/2.Sharkie/3.Swim/3.png',
        'img/2.Sharkie/3.Swim/4.png',
        'img/2.Sharkie/3.Swim/5.png',
        'img/2.Sharkie/3.Swim/6.png'
    ];

    IMAGES_SLEEPING = [
        'img/2.Sharkie/2.Long_IDLE/i1.png',
        'img/2.Sharkie/2.Long_IDLE/i2.png',
        'img/2.Sharkie/2.Long_IDLE/i3.png',
        'img/2.Sharkie/2.Long_IDLE/i4.png',
        'img/2.Sharkie/2.Long_IDLE/i5.png',
        'img/2.Sharkie/2.Long_IDLE/i6.png',
        'img/2.Sharkie/2.Long_IDLE/i7.png',
        'img/2.Sharkie/2.Long_IDLE/i8.png',
        'img/2.Sharkie/2.Long_IDLE/i9.png',
        'img/2.Sharkie/2.Long_IDLE/i10.png',
        'img/2.Sharkie/2.Long_IDLE/i11.png',
        'img/2.Sharkie/2.Long_IDLE/i12.png',
        'img/2.Sharkie/2.Long_IDLE/i13.png',
        'img/2.Sharkie/2.Long_IDLE/i14.png'
    ];

    IMAGES_DEAD = [
        'img/2.Sharkie/6.dead/1.Poisoned/1.png',
        'img/2.Sharkie/6.dead/1.Poisoned/2.png',
        'img/2.Sharkie/6.dead/1.Poisoned/3.png',
        'img/2.Sharkie/6.dead/1.Poisoned/4.png',
        'img/2.Sharkie/6.dead/1.Poisoned/5.png',
        'img/2.Sharkie/6.dead/1.Poisoned/6.png',
        'img/2.Sharkie/6.dead/1.Poisoned/7.png',
        'img/2.Sharkie/6.dead/1.Poisoned/8.png',
        'img/2.Sharkie/6.dead/1.Poisoned/9.png',
        'img/2.Sharkie/6.dead/1.Poisoned/10.png',
        'img/2.Sharkie/6.dead/1.Poisoned/11.png',
        'img/2.Sharkie/6.dead/1.Poisoned/12.png'
    ];

    IMAGES_POISONED = [
        'img/2.Sharkie/5.Hurt/1.Poisoned/1.png',
        'img/2.Sharkie/5.Hurt/1.Poisoned/2.png',
        'img/2.Sharkie/5.Hurt/1.Poisoned/3.png',
        'img/2.Sharkie/5.Hurt/1.Poisoned/4.png',
        'img/2.Sharkie/5.Hurt/1.Poisoned/5.png'
    ];

    IMAGES_ELECTRIC_SHOCK = [ // muss noch eingebaut werden - mit Quallen Kollision 
        'img/2.Sharkie/5.Hurt/2.Electric shock/1.png',
        'img/2.Sharkie/5.Hurt/2.Electric shock/2.png',
        'img/2.Sharkie/5.Hurt/2.Electric shock/3.png'
    ];

    world;

    constructor(){
        super().loadImage('img/2.Sharkie/1.IDLE/1.png');
        this.loadImages(this.IMAGES_REGULAR);
        this.loadImages(this.IMAGES_SWIMMING);
        this.loadImages(this.IMAGES_SLEEPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_POISONED);
        this.loadImages(this.IMAGES_ELECTRIC_SHOCK);

        this.animate();

        this.offset = {
            top: 140,
            left: 50,
            right: 50,
            bottom: 70
        };
    }

    animate() {
        // === Bewegung ===
        setInterval(() => {
            let moving = false;

            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.x += this.speed;
                this.otherDirection = false;
                moving = true;
            }

            if (this.world.keyboard.LEFT && this.x > 0) {
                this.x -= this.speed;
                this.otherDirection = true;
                moving = true;
            }

            if (this.world.keyboard.UP && this.y > -130) {
                this.y -= this.speed;
                moving = true;
            }

            if (this.world.keyboard.DOWN && this.y < 250) {
                this.y += this.speed;
                moving = true;
            }

            // Kamera folgt Sharkie
            this.world.camera_x = -this.x + 20;

            // === Bewegung prüfen ===
            if (moving) {
                this.idleTime = 0; 
            } else {
                this.idleTime += 1000 / 60;
            }
        }, 1000 / 60);

        setInterval(() => {
            const moving = this.world.keyboard.RIGHT || this.world.keyboard.LEFT || this.world.keyboard.UP || this.world.keyboard.DOWN;
        
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
        
            } else if (this.isHurt() || this.isPoisoned) {
                this.playAnimation(this.IMAGES_POISONED);
        
            } else if (this.isHurt() || this.isElectrocuted) {
                this.playAnimation(this.IMAGES_ELECTRIC_SHOCK);
        
            } else if (moving) {
                this.playAnimation(this.IMAGES_SWIMMING);
                this.idleTime = 0;
                this.hasFallenAsleep = false; 
        
            } else if (this.idleTime > this.sleepThreshold) {
                this.playSleepingAnimation(); 
        
            } else {
                this.playAnimation(this.IMAGES_REGULAR);
            }
        }, 120);
    }

    playSleepingAnimation() {
        const frames = this.IMAGES_SLEEPING;
        const totalFrames = frames.length;
        const loopStart = totalFrames - 4;
    
        if (!this.hasFallenAsleep) {
            this.hasFallenAsleep = true;
            this.sleepFrameIndex = 0;
            this.sleepLoopIndex = 0;
            this.lastSleepFrameTime = Date.now(); 
        }
    
        const now = Date.now();
 
        const loopDelay = 400; 
    
        if (this.sleepFrameIndex < totalFrames - 3) {
            this.img = this.imageCache[frames[this.sleepFrameIndex]];
            this.sleepFrameIndex++;
            this.lastSleepFrameTime = now; 
        }
    
        else if (now - this.lastSleepFrameTime >= loopDelay) {
            const loopFrames = frames.slice(loopStart, totalFrames);
            this.img = this.imageCache[loopFrames[this.sleepLoopIndex]];
            this.sleepLoopIndex = (this.sleepLoopIndex + 1) % loopFrames.length;
            this.lastSleepFrameTime = now; 
        }
    }
}