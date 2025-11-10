class CoinsBar extends DrawbleObject {

    IMAGES = [
        'img/5.Marcadores/green/Coin/0_  copia 4.png',
        'img/5.Marcadores/green/Coin/20_  copia 2.png',
        'img/5.Marcadores/green/Coin/40_  copia 4.png',
        'img/5.Marcadores/green/Coin/60_  copia 4.png',
        'img/5.Marcadores/green/Coin/80_  copia 4.png',
        'img/5.Marcadores/green/Coin/100_ copia 4.png'
    ];

    percentage = 100;

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 20;
        this.y = 80;
        this.width = 200;
        this.height = 60;
        this.setPercentage(0);
    };

    setPercentage(percentage) {
        this.percentage = percentage; // => 0 ... 5
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    };
        
    resolveImageIndex() {
        if (this.percentage >= 100) return 5;
        if (this.percentage > 80)  return 4;
        if (this.percentage > 60)  return 3;
        if (this.percentage > 40)  return 2;
        if (this.percentage > 20)  return 1;
        return 0;
    };
}