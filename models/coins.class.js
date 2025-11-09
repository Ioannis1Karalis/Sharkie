class Coins extends DrawbleObject {

    width = 40;
    height = 40;

    IMAGES = [ 
        'img/5.Marcadores/1. Coins/1.png'
    ];

    constructor(x, y) {
        super().loadImage(this.IMAGES);
        this.x = x;
        this.y = y;
    }

    
}