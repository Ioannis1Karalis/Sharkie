class Barrier extends MovableObject {

    width = 780;
    height = 520;
    x = 1000;
    y = 0;

    IMAGES = [ 
        'img/4.Background/Barrier/1.png'
    ];

    constructor() {
        super().loadImage(this.IMAGES);
    }
}