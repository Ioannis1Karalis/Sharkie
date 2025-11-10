class BackgroundObject extends MovableObject {

    width = 880;
    height = 520;

    constructor(imagePath, x, y) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = y;
        
    }
}