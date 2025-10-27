class MovableObject {
    x = 120;
    y = 120;
    img;
    height = 150;
    width = 100;
    imageCache = {};
    currentImage = 0; 
    speed = 0.15;
    otherDirection = false;

    loadImage(path) {
        this.img = new Image(); 
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    playAnimation(images) {
        let i = this.currentImage % this.IMAGES_SWIMMING.length; // let i = 0 % 6; 0, => Rest 0 // i = 0, 1, 2, 3, 4, 5, 6,... 0, 1, 2  
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