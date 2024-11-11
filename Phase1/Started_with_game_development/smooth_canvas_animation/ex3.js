"use strict";
let canvas;
let context;
let x = 500;
let y = 200;
let speedX = 300;
let speedY = 300;
let rectX = 0;
let rectY = 0;
let radius = 50;
let secondsPassed = 0;
let oldTimeStamp = 0;
let movingSpeed = 300;
let fps;
let averageFPS = 0;
let angle = 0;  // Góc bắt đầu
let angle2 = 0;
let width = 150;
let height = 100;
const button = document.getElementById('changeFPS');
window.onload = init;

function init() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    // Bắt đầu yêu cầu khung hình đầu tiên
    window.requestAnimationFrame(gameLoop);
}
function draw() {
      context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#ff8080';
    context.fillRect(rectX, rectY, width, height);

}


function gameLoop(timeStamp) {
    // Calculate how much time has passed
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
 secondsPassed = Math.min(secondsPassed, 0.1);
    // Pass the time to the update
    update(secondsPassed);
    draw();
   
    window.requestAnimationFrame(gameLoop);
}

function update(secondsPassed) {
   rectX += speedX * secondsPassed;
    rectY += speedY * secondsPassed;

    if (rectX + width > canvas.width || rectX < 0) {
        speedX = -speedX; 
    }
    if (rectY + height > canvas.height || rectY < 0) {
        speedY = -speedY;
    }
}