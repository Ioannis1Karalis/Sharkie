class MovableObject extends DrawbleObject {
    speed = 0.15;
    otherDirection = false;
    energy = 100; 
    lastHit = 0; 

    // character.isColliding(fish);
    isColliding(mo) {
        return (
            this.x + this.width - this.offset.right > mo.x + (mo.offset ? mo.offset.left : 0) &&
            this.x + this.offset.left < mo.x + mo.width - (mo.offset ? mo.offset.right : 0) &&
            this.y + this.height - this.offset.bottom > mo.y + (mo.offset ? mo.offset.top : 0) &&
            this.y + this.offset.top < mo.y + mo.height - (mo.offset ? mo.offset.bottom : 0)
        );
    }

    hit() {
        this.energy -= 5;
        if(this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; // Difference in ms 
        timepassed = timepassed / 1000; // Difference in s
        return timepassed < 0.6;
    }

    isDead() {
        return this.energy == 0;
    }

    playAnimation(images) {
        let i = this.currentImage % images.length; // let i = 0 % 6; 0, => Rest 0 // i = 0, 1, 2, 3, 4, 5, 6,... 0, 1, 2  
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    moveRight() {
        console.log('moving right');
    }

    moveLeft() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);
    }
}