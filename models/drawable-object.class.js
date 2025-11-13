class DrawbleObject {
    img;
    imageCache = {};
    currentImage = 0; 
    x = 120;
    y = 120;
    height = 150;
    width = 100;

    loadImage(path) {
        this.img = new Image(); 
        this.img.src = path;
    }

    draw(ctx) {
        if (!(this.img instanceof Image)) {
          return;
        }
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawFrame(ctx) {
        if (
            this instanceof Character ||
            this instanceof PufferFishRed ||
            this instanceof PufferFishGreen ||
            this instanceof JellyFish ||
            this instanceof Collectable ||
            this instanceof Endboss
        ) {
            const offset = this.offset || { top: 0, left: 0, right: 0, bottom: 0 };
    
            ctx.beginPath();
            ctx.lineWidth = "3";
            ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
            ctx.rect(
                this.x + offset.left,
                this.y + offset.top,
                this.width - offset.left - offset.right,
                this.height - offset.top - offset.bottom
            );
            ctx.stroke();
        }
    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
}