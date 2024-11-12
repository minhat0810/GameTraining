const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

class GameObject
{
    constructor (context, x, y, vx, vy){
        this.context = context;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;

        this.isColliding = false;
    }
}

let gameObjects;

class Square extends GameObject
{
    constructor (context, x, y, vx, vy){
        super(context, x, y, vx, vy);

        // Set default width and height
        this.width = 50;
        this.height = 50;
    }

    draw(){
        // Draw a simple square
        this.context.fillStyle = this.isColliding?'#ff8080':'#0099b0';
        this.context.fillRect(this.x, this.y, this.width, this.height);
    }

    update(secondsPassed){
        // Move with set velocity
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;
    }
    checkCollision() {
        if(this.x + this.width > canvas.width || this.x - this.width < 0){
            this.vx -= this.vx;
        }
        if(this.y + this.height > canvas.height || this.y - this.height < 0){
            this.vy -= this.vy;
        }
    }
}

class Circle extends GameObject
{
    constructor (context, x, y, vx, vy, radius){
        super(context, x, y, vx, vy);

        // Set default radius
        this.radius = radius || 25;
    }

    draw(){
        // Draw a simple circle
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.context.fillStyle = this.isColliding ? '#ff8080' : '#0099b0';
        this.context.fill();
    }

    update(secondsPassed){
        // Move with set velocity
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;
    }
}


function createWorld(){
    gameObjects = [
        new Circle(context, 250, 50, 0, 50),
        new Circle(context, 250, 300, 0, -50),
        new Circle(context, 150, 0, 50, 50),
        new Circle(context, 250, 150, 50, 50),
        new Circle(context, 350, 75, -50, 50),
        new Circle(context, 300, 300, 50, -50)
    ];
}
function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

let oldTimeStamp = 0;
function detectCollisions(){
    let obj1;
    let obj2;

    // Reset collision state of all objects
    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].isColliding = false;
    }

    // Start checking for collisions
    for (let i = 0; i < gameObjects.length; i++)
    {
        obj1 = gameObjects[i];
        for (let j = i + 1; j < gameObjects.length; j++)
        {
            obj2 = gameObjects[j];

            // Compare object1 with object2
            // if (rectIntersect(obj1.x, obj1.y, obj1.width, obj1.height, obj2.x, obj2.y, obj2.width, obj2.height)){
            //     obj1.isColliding = true;
            //     obj2.isColliding = true;
            // }
            if (circleIntersect(obj1.x, obj1.y, obj1.radius, obj2.x, obj2.y, obj2.radius)){
                obj1.isColliding = true;
                obj2.isColliding = true;
            }
        }
    }
}


function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
    // Check x and y for overlap
    if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2){
        return false;
    }
    return true;
}

function circleIntersect(x1, y1, r1, x2, y2, r2) {

    // Calculate the distance between the two circles
    let squareDistance = (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2);

    // When the distance is smaller or equal to the sum
    // of the two radius, the circles touch or overlap
    return squareDistance <= ((r1 + r2) * (r1 + r2))
}

// let vCollision = {x: obj2.x - obj1.x, y: obj2.y - obj1.y};

// let distance = Math.sqrt((obj2.x-obj1.x)*(obj2.x-obj1.x) + (obj2.y-obj1.y)*(obj2.y-obj1.y));

// let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
// let vRelativeVelocity = {x: obj1.vx - obj2.vx, y: obj1.vy - obj2.vy};
// let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

function gameLoop(timeStamp)
{
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    // Loop over all game objects
    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].update(secondsPassed);
    }
   detectCollisions();

    clearCanvas();

    // Do the same to draw
    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].draw();
    }

    window.requestAnimationFrame(gameLoop);
}

createWorld();
window.requestAnimationFrame(gameLoop);