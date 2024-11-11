
"use strict";
        let canvas;
        let context;
        let x = 50;
        let y = 300;

        window.onload = init;

        function init() {
            canvas = document.getElementById('canvas');
            context = canvas.getContext('2d');
            draw();
        }

        function draw() {   
           const heartPath = new Path2D("M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z");
            // Thiết lập màu sắc và kích thước
            context.fillStyle = "red"; // Màu đỏ cho hình trái tim
            context.scale(1, 1);   // Thu nhỏ hình xuống còn 50% kích thước gốc
            context.translate(100, 50);
            // Vẽ hình trái tim
            context.fill(heartPath);

        }
