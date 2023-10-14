class GameObject
{
    constructor (context, x, y, vx, vy, mass){
        this.context = context;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.mass = mass;

        this.isColliding = false;
    }
}


class GameWorld {
    constructor(canvasId) {
        this.canvas = null;
        this.context = null;
        this.secondsPassed = 0;
        this.oldTimeStamp = 0;
        this.gameObjects = [];
        this.resetCounter = 0;

        this.init(canvasId);
    }

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');

        this.createWorld();

        window.requestAnimationFrame((timeStamp) => { this.gameLoop(timeStamp) });
    }

    createWorld() {
        this.gameObjects = [
            new Square(this.context, 250, 50, 0, 50, 1),
            new Square(this.context, 250, 300, 0, -50, 200),
            new Square(this.context, 200, 0, 50, 50, 1),
            new Square(this.context, 250, 150, 50, 50, 1),
            new Square(this.context, 300, 75, -50, 50, 1),
            new Square(this.context, 300, 300, 50, -50, 1)
        ];
    }

    gameLoop(timeStamp) {
        this.secondsPassed = (timeStamp - this.oldTimeStamp) / 1000;
        this.oldTimeStamp = timeStamp;

        for (let i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].update(this.secondsPassed, this.canvas.width, this.canvas.height);
        }

        this.detectCollisions();
        this.clearCanvas();

        for (let i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].draw();
        }

        window.requestAnimationFrame((timeStamp) => this.gameLoop(timeStamp));
    }

    detectCollisions() {
        let obj1;
        let obj2;

        for (let i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].isColliding = false;
        }

        for (let i = 0; i < this.gameObjects.length; i++) {
            obj1 = this.gameObjects[i];
            for (let j = i + 1; j < this.gameObjects.length; j++) {
                obj2 = this.gameObjects[j];

                if (this.rectIntersect(obj1.x, obj1.y, obj1.width, obj1.height, obj2.x, obj2.y, obj2.width, obj2.height)) {
                    obj1.isColliding = true;
                    obj2.isColliding = true;

                    let vCollision = { x: obj2.x - obj1.x, y: obj2.y - obj1.y };
                    let distance = Math.sqrt((obj2.x - obj1.x) * (obj2.x - obj1.x) + (obj2.y - obj1.y) * (obj2.y - obj1.y));
                    let vCollisionNorm = { x: vCollision.x / distance, y: vCollision.y / distance };
                    let vRelativeVelocity = { x: obj1.vx - obj2.vx, y: obj1.vy - obj2.vy };
                    let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

                    if (speed < 0) {
                        break;
                    }

                    let impulse = 2 * speed / (obj1.mass + obj2.mass);
                    obj1.vx -= (impulse * obj2.mass * vCollisionNorm.x);
                    obj1.vy -= (impulse * obj2.mass * vCollisionNorm.y);
                    obj2.vx += (impulse * obj1.mass * vCollisionNorm.x);
                    obj2.vy += (impulse * obj1.mass * vCollisionNorm.y);

                    this.handleWallCollision(obj1);
                    this.handleWallCollision(obj2);
                }
            }
        }
    }

    rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
        if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2) {
            return false;
        }

        return true;
    }

    handleWallCollision(object) {
        if (object.x < 0 || object.x + object.width > this.canvas.width) {
            object.vx = -object.vx;
        }
        if (object.y < 0 || object.y + object.height > this.canvas.height) {
            object.vy = -object.vy;
        }
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

class Square {
    constructor(context, x, y, vx, vy, mass) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.mass = mass;
        this.width = 50;
        this.height = 50;
        this.isColliding = false;
    }

    update(secondsPassed, canvasWidth, canvasHeight) {
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;

        this.handleWallCollision(canvasWidth, canvasHeight);
    }

    handleWallCollision(canvasWidth, canvasHeight) {
        if (this.x < 0 || this.x + this.width > canvasWidth) {
            this.vx = -this.vx;
        }
        if (this.y < 0 || this.y + this.height > canvasHeight) {
            this.vy = -this.vy;
        }
    }

    draw() {
        this.context.fillStyle = this.isColliding ? "red" : "blue";
        this.context.fillRect(this.x, this.y, this.width, this.height);
    }
}


// Listen to the onLoad event, then create a game world
window.onload = function (){
    let gameWorld = new GameWorld('canvas');
}