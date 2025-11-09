class JellyFish extends MovableObject {
    height = 70;
    width = 80;

    IMAGES_SWIMMING = [
        'img/3.Enemy/2 Jelly fish/Regular damage/Lila 1.png',
        'img/3.Enemy/2 Jelly fish/Regular damage/Lila 2.png',
        'img/3.Enemy/2 Jelly fish/Regular damage/Lila 3.png',
        'img/3.Enemy/2 Jelly fish/Regular damage/Lila 4.png'
    ];

    IMAGES_DANGEROUS = [
        'img/3.Enemy/2 Jelly fish/Super dangerous/Green 1.png',
        'img/3.Enemy/2 Jelly fish/Super dangerous/Green 2.png',
        'img/3.Enemy/2 Jelly fish/Super dangerous/Green 3.png',
        'img/3.Enemy/2 Jelly fish/Super dangerous/Green 4.png'
    ];

    IMAGES_DEAD_LILA = [
        'img/3.Enemy/2 Jelly fish/Dead/Lila/L1.png',
        'img/3.Enemy/2 Jelly fish/Dead/Lila/L2.png',
        'img/3.Enemy/2 Jelly fish/Dead/Lila/L3.png',
        'img/3.Enemy/2 Jelly fish/Dead/Lila/L4.png'
    ];

    IMAGES_DEAD_GREEN = [
        'img/3.Enemy/2 Jelly fish/Dead/green/g1.png',
        'img/3.Enemy/2 Jelly fish/Dead/green/g2.png',
        'img/3.Enemy/2 Jelly fish/Dead/green/g3.png',
        'img/3.Enemy/2 Jelly fish/Dead/green/g4.png'
    ];

    constructor(x, y) {
        super().loadImage(this.IMAGES_SWIMMING[0]);
        this.loadImages(this.IMAGES_SWIMMING);
        this.loadImages(this.IMAGES_DANGEROUS);

        this.x = x || 850;
        this.y = y || 200;
        this.startY = this.y;
        this.amplitude = 155;
        this.speed = 0.001;

        this.phaseOffset = Math.random() * Math.PI * 2;

        this.isDangerous = false; 
        this.animate();
    }

    animate() {
        setInterval(() => {
            let time = Date.now();
            this.y = this.startY + Math.sin(time * this.speed + this.phaseOffset) * this.amplitude;
        }, 1000 / 60);

        setInterval(() => {
            if (this.isDangerous) {
                this.playAnimation(this.IMAGES_DANGEROUS);
            } else {
                this.playAnimation(this.IMAGES_SWIMMING);
            }
        }, 150);

        setInterval(() => {
            this.isDangerous = !this.isDangerous;
        }, 6000);
    }
}