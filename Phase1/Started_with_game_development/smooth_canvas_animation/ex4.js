"use strict";

let canvas;
let context;
let speedX = 300;
let speedY = 300;
let rectX = 0;
let rectY = 0;
let radius = 50;
let secondsPassed = 0;
let oldTimeStamp = 0;
let movingSpeed = 300;
let fps;
let width = 150;
let height = 100; 
let directionX = 0; // Hướng di chuyển trên trục X
let directionY = 0; // Hướng di chuyển trên trục Y
let speed = 200;
let fpsDisplay = 0; 

window.onload = init;

function init() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    // Thêm sự kiện nhấn và thả phím để điều khiển hình chữ nhật
    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);

    window.requestAnimationFrame(gameLoop);
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#4CAF50";
    context.fillRect(rectX, rectY, width, height);

        context.font = '16px Arial';
    context.fillStyle = '#000';
    context.fillText("FPS: " + fpsDisplay.toFixed(0), 10, 20);
}

function gameLoop(timeStamp) {
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    secondsPassed = Math.min(secondsPassed, 0.1);
    fps = 1 / secondsPassed;
    fpsDisplay = fps;

    update(secondsPassed);

    draw();

    window.requestAnimationFrame(gameLoop);
}

function update(secondsPassed) {
    // Cập nhật vị trí dựa trên tốc độ và hướng
    rectX += speed * directionX * secondsPassed;
    rectY += speed * directionY * secondsPassed;

    // Giữ hình chữ nhật trong vùng canvas
    if (rectX < 0) rectX = 0;
    if (rectX + width > canvas.width) rectX = canvas.width - width;
    if (rectY < 0) rectY = 0;
    if (rectY + height > canvas.height) rectY = canvas.height - height;
}

function keyDownHandler(event) {
    switch (event.key) {
        case "ArrowUp":
            directionY = -1;
            break;
        case "ArrowDown":
            directionY = 1;
            break;
        case "ArrowLeft":
            directionX = -1;
            break;
        case "ArrowRight":
            directionX = 1;
            break;
    }
}

function keyUpHandler(event) {
    switch (event.key) {
        case "ArrowUp":
        case "ArrowDown":
            directionY = 0; // Dừng di chuyển theo trục Y
            break;
        case "ArrowLeft":
        case "ArrowRight":
            directionX = 0; // Dừng di chuyển theo trục X
            break;
    }
}
