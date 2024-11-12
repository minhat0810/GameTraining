 
 const canvas = document.getElementById("gameCanvas");
  const context = canvas.getContext("2d");

  // Gravity acceleration (in pixels per frame squared)
const gravity = 0.5;
//Air Resistance
const airResistance = 0.99;

// Object properties
// let ball = {
//     position: { x: 300, y: 50 }, // Starting near the top
//     velocity: { x: 0, y: 0 },     // Initial velocity
//     radius: 20,                   // Size of the ball
//     color: "blue"
// };

let balls = [];
class Ball{
    constructor(x,y,radius,color){
        this.position = {x,y};
        this.velocity = {x: 0,y: 0};
        this.radius = radius;
        this.color = color;
    }
     drawBall() {
   // 
    context.beginPath();
    context.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();
    }
      //  this.velocity.x = 2;
 applyGravity() {
    
    // Apply gravity to the velocity
    this.velocity.y += gravity;
    this.velocity.x *= airResistance;
    this.velocity.y *= airResistance;
    
    // Update position by the velocity
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    }
 checkCollision() {
    // Check if ball hits the bottom of the canvasthis
    if (this.position.y + this.radius > canvas.height) {
        // Reverse the velocity to simulate a bounce
        this.velocity.y *= -0.7; // 0.7 to lose energy each bounce
        this.position.y = canvas.height - this.radius; // Keep the ball above the floor
    }
    if (this.position.y - this.radius < 0) {
        this.velocity.y *= -0.7; // 0.7 to lose energy each bounce
        this.position.y = 0+this.radius; // Keep the ball above the floor
    }
    if(this.position.x + this.radius > canvas.width){
        this.velocity.x *= -0.7;
        this.position.x = canvas.width-this.radius;
    }
    if(this.position.x - this.radius < 0){
         this.velocity.x *= -0.7;
        this.position.x = 0+this.radius;
    }
    }
    jump(){
        this.velocity.y = -10;
    }
}
for (let i = 0; i < 5; i++) {
    balls.push(new Ball(Math.random() * canvas.width, Math.random() * canvas.height / 2, 20, 'blue'));
}

function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
     balls.forEach(ball => {
        ball.applyGravity();
        ball.checkCollision();
        ball.drawBall();
    });

    requestAnimationFrame(gameLoop); // Continue the loop
}

gameLoop(); // Start the animation
window.addEventListener("keydown",(event)=>{
    switch(event.key){
        case "ArrowUp": 
        balls.forEach(ball => {
           ball.jump();
        });
    }
});