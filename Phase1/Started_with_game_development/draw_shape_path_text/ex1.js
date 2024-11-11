
"use strict";
        let canvas;
        let context;
        let x = 50;
        let y = 300;
        let radius = 50;
        let speedX = 2;
        let speedY = 2;

        window.onload = init;

        function init() {
            canvas = document.getElementById('canvas');
            context = canvas.getContext('2d');
            draw();
        }

        function draw() {   
            //thân
            context.fillStyle = "yellow";
            context.fillRect(200, 200, 400, 200);

            //nóc
            context.beginPath();
            context.moveTo(150,200);
            context.lineTo(400,100);
            context.lineTo(650, 200);
            context.lineTo(150,200);
            context.fillStyle = "red";
            context.fill()
            context.stroke();
            
            //cửa
            context.fillStyle = "brown";
            context.fillRect(360, 280, 80, 120);

            context.fillStyle = "white";
            context.fillRect(250, 250, 50, 50);

            context.fillStyle = "white";
            context.fillRect(500, 250, 50, 50);

        }
