const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

let vector = { x: 0, y: 0 };
let position = { x: 100, y: 100 }; // Starting position
let velocity = { x: 2, y: 3 };     // Speed and direction of movement

class Vector{
  constructor(x, y) {
        this.x = x;
        this.y = y;
    }
        static addVectors(v1, v2) {
                return { x: v1.x + v2.x, y: v1.y + v2.y };
            }
        static subtractVectors(v1, v2) {
            return { x: v1.x - v2.x, y: v1.y - v2.y };
            }
        static multiplyVector(v, scalar) {
            return { x: v.x * scalar, y: v.y * scalar };
        }
        magnitude(v) {
            return Math.sqrt(v.x * v.x + v.y * v.y);
        }
        normalize(v) {
            let mag = magnitude(v);
            return { x: v.x / mag, y: v.y / mag };
        }
}

function drawCircle(position) {
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    context.beginPath();
    context.arc(position.x, position.y, 20, 0, Math.PI * 2); // Draw circle
    context.fillStyle = "blue";
    context.fill();
    context.closePath();
}
function updatePosition() {
    position = Vector.addVectors(position, velocity); // Using Vector.add
}

class Circle {
    constructor(x, y, vx, vy) {
        this.position = new Vector(x, y);
        this.velocity = new Vector(vx, vy);
        this.radius = 20;
    }

    updatePositionBall() {
        this.position = Vector.addVectors(this.position, this.velocity);
        
        if (this.position.x <= this.radius || this.position.x >= canvas.width - this.radius) {
            this.velocity.x *= -1;
        }
        if (this.position.y <= this.radius || this.position.y >= canvas.height - this.radius) {
            this.velocity.y *= -1;
        }
    }

    draw() {
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = "blue";
        context.fill();
        context.closePath();
    }
}

const circles = [];
for (let i = 0; i < 5; i++) {
    const randomX = Math.random() * (canvas.width - 40) + 20;
    const randomY = Math.random() * (canvas.height - 40) + 20;
    const randomVX = (Math.random() - 0.5) * 4; // Random velocity between -2 and 2
    const randomVY = (Math.random() - 0.5) * 4;
    circles.push(new Circle(randomX, randomY, randomVX, randomVY));
}
window.addEventListener("keydown", (event) => {
    const speed = 2; // Mức độ tăng/giảm vận tốc
    switch (event.key) {
        case "ArrowUp":
            circles.forEach(circle => {
                circle.velocity.y += speed; 
            });
            break;
        case "ArrowDown":
            circles.forEach(circle => {
                circle.velocity.y -= speed; 
            });
            break;
    }
});


function gameLoop() {
     context.clearRect(0, 0, canvas.width, canvas.height);
    updatePosition();
    //drawCircle(position);
    circles.forEach(circle => {
        circle.updatePositionBall();
        circle.draw();
    });
    requestAnimationFrame(gameLoop); // Call gameLoop on the next frame
}

gameLoop(); // Start the animation


    