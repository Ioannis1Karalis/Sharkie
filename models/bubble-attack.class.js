class BubbleAttack extends MovableObject {

    constructor(x, y) {
        super().loadImage('img/2.Sharkie/4.Attack/Bubble trap/Bubble.png');
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.throw(20, 20)
    }
    
    throw() {
        this.speedY = 30;
        setInterval(() => {
            this.x += 10;
        }, 30);
    }
}