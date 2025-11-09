class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    healthBar = new HealthBar();
    coinsBar = new CoinsBar();
    poisonBar = new PoisonBar();
    bubbleAttack = [new BubbleAttack()];
    barrier = new Barrier();

    constructor(canvas, keyboard){
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.swim();
    }

    setWorld() {
        this.character.world = this; 
    }

    swim() {
        setInterval(() => {
            this.checkCollisions();
            this.checkThrowableObjects();
        }, 200)

    }

    checkThrowableObjects() {
        if(this.keyboard.D) {
            let bubbleAttack = new BubbleAttack(this.character.x, this.character.y + 100)
            this.bubbleAttack.push(bubbleAttack);
        }
    }

    checkCollisions() {
        this.level.enemies.forEach( (enemy) => {
            if (this.character.isColliding(enemy) ) {
                this.character.hit();
                this.healthBar.setPercentage(this.character.energy);
            }
        });
     
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addToMap(this.barrier);

        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.poisonBar);
        this.addToMap(this.healthBar);
        this.addToMap(this.coinsBar);
        this.ctx.translate(this.camera_x, 0);

        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.bubbleAttack);

        this.ctx.translate(-this.camera_x, 0);
 
        // draw() wird immer wieder aufgerufen 
        let self = this; 
        requestAnimationFrame(function() {
            self.draw();
        });
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        })
    }

    addToMap(mo) {
        if(mo.otherDirection) {
            this.flipImage(mo);
        }

        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}