"use strict";
let canvas;
let context;
let x = 500;
let y = 200;
let speedX = 2;
let speedY = 2;
let rectX = 0;
let rectY = 0;
let radius = 50;
let secondsPassed = 0;
let oldTimeStamp = 0;
let movingSpeed = 10;
let fps;
let averageFPS = 0;
let angle = 0;  // Góc bắt đầu
let angle2 = 0;
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
    context.fillRect(rectX, rectY, 150, 100);

    context.fillStyle = '#ff8080';
    context.fillRect(x, y, 150, 100);
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
    // Use time to calculate new position
    // rectX += (movingSpeed * secondsPassed);
    // rectY += (movingSpeed * secondsPassed);
    angle += movingSpeed * secondsPassed;
    rectX = canvas.width/4 + Math.cos(angle)*radius;
    rectY = canvas.height/4 + Math.sin(angle)*radius;

    angle2 -= movingSpeed * secondsPassed; 
    x = canvas.width/2 + Math.cos(angle2)*radius*2;
    y = canvas.height/2 + Math.sin(angle2)*radius*2;
}