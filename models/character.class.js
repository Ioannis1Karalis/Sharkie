class Character extends MovableObject{

    height = 300;
    width = 250;
    y = 10;
    x = 10;
    speed = 10;
    IMAGES_SWIMMING = [
        'img/2.Sharkie/3.Swim/1.png',
        'img/2.Sharkie/3.Swim/2.png',
        'img/2.Sharkie/3.Swim/3.png',
        'img/2.Sharkie/3.Swim/4.png',
        'img/2.Sharkie/3.Swim/5.png',
        'img/2.Sharkie/3.Swim/6.png'
    ];
    world;

    constructor(){
        super().loadImage('img/2.Sharkie/1.IDLE/1.png');
        this.loadImages(this.IMAGES_SWIMMING);

        this.animate();
    }

    animate() {

        setInterval(() => {
            if(this.world.keyboard.RIGHT) {
                this.x += this.speed;
                this.otherDirection = false;
            }

            if(this.world.keyboard.LEFT) {
                this.x -= this.speed;
                this.otherDirection = true;
            }

            if(this.world.keyboard.UP) {
                this.y -= this.speed;
            }

            if(this.world.keyboard.DOWN) {
                this.y += this.speed;
            }
            this.world.camera_x = -this.x;
        }, 1000 / 60); 


        setInterval(() => {

            if(this.world.keyboard.RIGHT || this.world.keyboard.LEFT || this.world.keyboard.UP || this.world.keyboard.DOWN) {

                let i = this.currentImage % this.IMAGES_SWIMMING.length; // let i = 0 % 6; 0, => Rest 0 // i = 0, 1, 2, 3, 4, 5, 6,... 0, 1, 2  
                let path = this.IMAGES_SWIMMING[i];
                this.img = this.imageCache[path];
                this.currentImage++;
            }
        }, 100)
    }

    jump(){

    }
}