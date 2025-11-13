class MovableObject extends DrawbleObject {
    speed = 0.15;
    otherDirection = false;
    energy = 100; 
    lastHit = 0; 

    // character.isColliding(fish);
    isColliding(mo) {
        if (!mo) return false;
      
        const a = this.offset || { top: 0, left: 0, right: 0, bottom: 0 };
        const b = mo.offset   || { top: 0, left: 0, right: 0, bottom: 0 };
      
        return (
          this.x + this.width  - a.right  > mo.x + b.left &&
          this.x + a.left                  < mo.x + mo.width  - b.right &&
          this.y + this.height - a.bottom > mo.y + b.top &&
          this.y + a.top                   < mo.y + mo.height - b.bottom
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