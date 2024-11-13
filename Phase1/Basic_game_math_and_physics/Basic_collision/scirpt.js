const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
const g = 9.81;
// Define the edges of the canvas
 const canvasWidth = 600;
 const canvasHeight = 400;

 // Set a restitution, a lower value will lose more energy when colliding
 const restitution = 0.90;


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
        this.width = 70;
        this.height = 50;
    }

    draw(){
        // Draw a simple square
        this.context.fillStyle = this.isColliding?'#ff8080':'#0099b0';
        this.context.fillRect(this.x, this.y, this.width, this.height);
        
    }

    update(secondsPassed){
        //thêm gia tốc trọng trường
       // this.vy += g * secondsPassed;
        // Move with set velocity
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;
        this.checkBoundaryCollision();
    }
        checkBoundaryCollision() {
         // Kiểm tra va chạm với viền bên trái và phải của canvas
            if (this.x + this.width > canvas.width) {
                this.vx = -Math.abs(this.vx) * restitution; // Đảo chiều vận tốc và áp dụng độ đàn hồi
                this.x = canvas.width - this.width; // Đặt vị trí x để không vượt quá biên
            } else if (this.x < 0) {
                this.vx = Math.abs(this.vx) * restitution;
                this.x = 0;
            }

            // Kiểm tra va chạm với viền trên và dưới của canvas
            if (this.y + this.height > canvas.height) {
                this.vy = -Math.abs(this.vy) * restitution;
                this.y = canvas.height - this.height;
            } else if (this.y < 0) {
                this.vy = Math.abs(this.vy) * restitution;
                this.y = 0;
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

         this.context.beginPath();
        this.context.moveTo(this.x, this.y);
        this.context.lineTo(this.x + this.vx, this.y + this.vy);
        this.context.stroke();
    }

    update(secondsPassed){
        // Move with set velocity
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;
    //    this.checkBoundaryCollision();

          // Calculate the angle (vy before vx)
        let radians = Math.atan2(this.vy, this.vx);

         // Convert to degrees
         let degrees = 180 * radians / Math.PI;
    }
    checkBoundaryCollision() {
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.vx = -this.vx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.vy = -this.vy;
        }
    }
}


function createWorld(){
    gameObjects = [
        new Circle(context, 250, 50, 0, 50),
        new Circle(context, 250, 300, 0, -50),
        new Circle(context, 150, 50, 50, 50),
        new Square(context, 250, 150, 50, 50),
        new Square(context, 350, 75, -50, 50),
        new Square(context, 300, 300, 50, -50)
    ];
}
function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}
 function detectEdgeCollisions()
 {
     let obj;
     for (let i = 0; i < gameObjects.length; i++)
     {
         obj = gameObjects[i];

         // Check for left and right
         if (obj.x < obj.radius){
             obj.vx = Math.abs(obj.vx) * restitution;
             obj.x = obj.radius;
         }else if (obj.x > canvasWidth - obj.radius){
             obj.vx = -Math.abs(obj.vx) * restitution;
             obj.x = canvasWidth - obj.radius;
         }

         // Check for bottom and top
         if (obj.y < obj.radius){
             obj.vy = Math.abs(obj.vy) * restitution;
             obj.y = obj.radius;
         } else if (obj.y > canvasHeight - obj.radius){
             obj.vy = -Math.abs(obj.vy) * restitution;
             obj.y = canvasHeight - obj.radius;
         }
     }
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
            // if (circleIntersect(obj1.x, obj1.y, obj1.radius, obj2.x, obj2.y, obj2.radius)){
            //     obj1.isColliding = true;
            //     obj2.isColliding = true;
            //     let vCollision = {x: obj2.x - obj1.x, y: obj2.y - obj1.y};
            //     let distance = Math.sqrt((obj2.x-obj1.x)*(obj2.x-obj1.x) + (obj2.y-obj1.y)*(obj2.y-obj1.y));
            //     let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
            //     let vRelativeVelocity = {x: obj1.vx - obj2.vx, y: obj1.vy - obj2.vy};
            //     let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

            //  //   speed *= Math.min(obj1.restitution, obj2.restitution);
            //     //console.log(speed);
                
            //     if (speed < 0){
            //         break;
            //     }
            //     obj1.vx -= (speed * vCollisionNorm.x);
            //     obj1.vy -= (speed * vCollisionNorm.y);
            //     obj2.vx += (speed * vCollisionNorm.x);
            //     obj2.vy += (speed * vCollisionNorm.y);
            // }
                        // Va chạm giữa hai hình tròn (circle-circle)
            if (obj1 instanceof Circle && obj2 instanceof Circle) {
                if (circleIntersect(obj1.x, obj1.y, obj1.radius, obj2.x, obj2.y, obj2.radius)) {
                    obj1.isColliding = true;
                    obj2.isColliding = true;
                    handleCollision(obj1, obj2);
                }
            }
            // Va chạm giữa hai hình chữ nhật (rect-rect)
            else if (obj1 instanceof Square && obj2 instanceof Square) {
                if (rectIntersect(obj1.x, obj1.y, obj1.width, obj1.height, obj2.x, obj2.y, obj2.width, obj2.height)) {
                    obj1.isColliding = true;
                    obj2.isColliding = true;
                    handleCollision(obj1, obj2);
                }
            }
            // Va chạm giữa hình tròn và hình chữ nhật (circle-rect)
            else if ((obj1 instanceof Circle && obj2 instanceof Square) || (obj1 instanceof Square && obj2 instanceof Circle)) {
                let circle = obj1 instanceof Circle ? obj1 : obj2;
                let rect = obj1 instanceof Square ? obj1 : obj2;

                if (circleRect(circle.x, circle.y, circle.radius, rect.x, rect.y, rect.width, rect.height)) {
                    circle.isColliding = true;
                    rect.isColliding = true;
                    handleCollision(circle, rect);
                }
            }
        }
    }
}
function handleCollision(obj1, obj2) {
    // Xử lý thay đổi vận tốc sau va chạm
    let vCollision = {x: obj2.x - obj1.x, y: obj2.y - obj1.y};
    let distance = Math.sqrt(vCollision.x * vCollision.x + vCollision.y * vCollision.y);
    let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
    let vRelativeVelocity = {x: obj1.vx - obj2.vx, y: obj1.vy - obj2.vy};
    let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

    if (speed < 0) return;

    obj1.vx -= speed * vCollisionNorm.x;
    obj1.vy -= speed * vCollisionNorm.y;
    obj2.vx += speed * vCollisionNorm.x;
    obj2.vy += speed * vCollisionNorm.y;
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

function circleRect(cx, cy, radius, rx, ry, rw, rh) {
    let testX = cx;
    let testY = cy;

    if (cx < rx)         testX = rx;      
    else if (cx > rx+rw) testX = rx+rw;   
    if (cy < ry)         testY = ry;      
    else if (cy > ry+rh) testY = ry+rh;   

    let distX = cx - testX;
    let distY = cy - testY;
    let distance = Math.sqrt((distX * distX) + (distY * distY));
   
    
     if (distance <= radius) {
         console.log(distance);
            return true;
        }
        return false;
}


function gameLoop(timeStamp)
{
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    // Loop over all game objects
    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].update(secondsPassed);
    }
    detectCollisions();
    detectEdgeCollisions();
    clearCanvas();

    // Do the same to draw
    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].draw();
    }

    window.requestAnimationFrame(gameLoop);
}

createWorld();
window.requestAnimationFrame(gameLoop);