class Character extends MovableObject{

    height = 300;
    width = 250;
    y = 40;
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

    IMAGES_ELECTRIC_SHOCK = [
        'img/2.Sharkie/5.Hurt/2.Electric shock/1.png',
        'img/2.Sharkie/5.Hurt/2.Electric shock/2.png',
        'img/2.Sharkie/5.Hurt/2.Electric shock/3.png'
    ];


    world;

    constructor(){
        super().loadImage('img/2.Sharkie/1.IDLE/1.png');
        this.loadImages(this.IMAGES_SWIMMING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_POISONED);
        this.loadImages(this.IMAGES_ELECTRIC_SHOCK);

        this.animate();
    }

    animate() {

        setInterval(() => {
            if(this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.x += this.speed;
                this.otherDirection = false;
            }

            if(this.world.keyboard.LEFT && this.x > 0) {
                this.x -= this.speed;
                this.otherDirection = true;
            }

            if(this.world.keyboard.UP && this.y > -130) {
                this.y -= this.speed;
            }

            if(this.world.keyboard.DOWN && this.y < 180) {
                this.y += this.speed;
            }
            this.world.camera_x = -this.x + 80;
        }, 1000 / 60); 


        setInterval(() => {

            if(this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isHurt()){
                this.playAnimation(this.IMAGES_POISONED);
            } else if (this.isHurt()){
                this.playAnimation(this.IMAGES_ELECTRIC_SHOCK);
            } else {
                if(this.world.keyboard.RIGHT || this.world.keyboard.LEFT || this.world.keyboard.UP || this.world.keyboard.DOWN) {
                    
                    this.playAnimation(this.IMAGES_SWIMMING);
                }
            }   
        }, 100)
    }
    
}