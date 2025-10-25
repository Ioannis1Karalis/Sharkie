class Fish extends MovableObject {

    height = 70;
    width = 80;
    IMAGES_SWIMMING = [
        'img/3.Enemy/1.Puffer fish/1.Swim/3.swim1.png',
        'img/3.Enemy/1.Puffer fish/1.Swim/3.swim2.png',
        'img/3.Enemy/1.Puffer fish/1.Swim/3.swim3.png',
        'img/3.Enemy/1.Puffer fish/1.Swim/3.swim4.png',
        'img/3.Enemy/1.Puffer fish/1.Swim/3.swim5.png'
    ];

    constructor(){
        super().loadImage('img/3.Enemy/1.Puffer fish/1.Swim/3.swim1.png')
        this.loadImages(this.IMAGES_SWIMMING);

        this.x = 250 + Math.random() * 500;
        this.y = 100 + Math.random() * 200;
        this.speed = 0.15 + Math.random() * 0.45;

        this.animate();
    }

    animate() {
        this.moveLeft();

        setInterval(() => {
            let i = this.currentImage % this.IMAGES_SWIMMING.length;
            let path = this.IMAGES_SWIMMING[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 150)
    }
}