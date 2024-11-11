"use strict";
let canvas;
let context;
let x = 200;
let y = 100;
let speedX = 2;
let speedY = 2;
let speedMoving = 1;
let radius = 50;
let secondsPassed;
let oldTimeStamp;
let fps;
let FPScapped;
let cappedFPS = false;
const CAP_FPS = 30;
let frameTimes = []; // Mảng lưu trữ timestamp của các khung hình
let averageFPS = 0;

const button = document.getElementById('changeFPS');
window.onload = init;

function init() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    // Bắt đầu yêu cầu khung hình đầu tiên
    window.requestAnimationFrame(gameLoop);
}

function gameLoop(timeStamp) {
    // Kiểm tra nếu FPS bị giới hạn
    if (cappedFPS) {
        // Kiểm tra xem có đủ thời gian để giới hạn FPS không
        if (timeStamp - oldTimeStamp < 1000 / CAP_FPS) {
          //  context.fillText("FPS (avg): " + fps, 10, 30);
            update();
             fps= Math.round(1/(timeStamp-oldTimeStamp));
            window.requestAnimationFrame(gameLoop);
            return; // Bỏ qua vòng lặp nếu chưa đủ thời gian để giới hạn FPS
        }
        oldTimeStamp = timeStamp;
    }

    // Tính toán thời gian đã trôi qua từ khung hình trước
    if (!oldTimeStamp) oldTimeStamp = timeStamp;
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    // Thêm timestamp của khung hình vào mảng frameTimes
    frameTimes.push(timeStamp);

    // Lọc các timestamp trong vòng 1 giây
    frameTimes = frameTimes.filter(t => timeStamp - t < 1000);

    // Tính toán FPS trung bình trong 1 giây
    averageFPS = frameTimes.length;
    
     fps = Math.round(1/secondsPassed);

  
     
    // Vẽ quả bóng
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fill();
    context.stroke();

    // Di chuyển quả bóng
    update()
    // Kiểm tra va chạm với biên
    if (x + radius > canvas.width || x - radius < 0) {
        speedX = -speedX;
    }

    if (y + radius > canvas.height || y - radius < 0) {
        speedY = -speedY;
    }

    // Hiển thị FPS trung bình lên màn hình
    context.fillStyle = 'black';
    context.font = '25px Arial';
    context.fillText("FPS (avg): " + fps, 10, 30);

    // Tiếp tục yêu cầu khung hình tiếp theo
    window.requestAnimationFrame(gameLoop);
}
function update(){
        x += speedX;
         y += speedY;
}
button.addEventListener('click', function (e) {
    cappedFPS = !cappedFPS;
    if (cappedFPS) {
        console.log("FPS capped to 30.");
    } else {
        console.log("FPS uncapped.");
    }
});
