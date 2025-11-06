class ThrowableObject extends MovableObject {

    constructor() {
        super().loadImage('img/2.Sharkie/4.Attack/Bubble trap/Bubble.png');
        this.x = 100;
        this.y = 100;
        this.throw(20, 20)
    }
    
    throw(x,y) {
        this.x = x;
        this.y = y;
        this.speedY = 30;
        setInterval(() => {
            this.x += 10;
        }, 50);
    }
}