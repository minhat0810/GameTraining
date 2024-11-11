"use strict";
        let canvas;
        let ctx;
        let x = 50;
        let y = 300;
        let radius = 50;
        let speedX = 2;
        let speedY = 2;

        window.onload = init;

        function init() {
            canvas = document.getElementById('canvas');
            ctx = canvas.getContext('2d');

            draw()
        }
// Draw Circle (Background Shape)
   function draw(){
     ctx.beginPath();
    ctx.arc(150, 150, 100, 0, Math.PI * 2, false);  // (x, y, radius, startAngle, endAngle)
    ctx.fillStyle = '#FF6347';  // Tomato red
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#8B0000';  // Dark red stroke
    ctx.stroke();
    ctx.closePath();

    // Draw Rectangle (Middle Shape)
    ctx.beginPath();
    ctx.rect(100, 100, 100, 100);  // (x, y, width, height)
    ctx.fillStyle = '#FFD700';  // Gold
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#B8860B';  // Dark goldenrod
    ctx.stroke();
    ctx.closePath();

    // Draw Text
    ctx.font = '30px Arial';
    ctx.fillStyle = '#FFFFFF';  // White text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Nhat', 150, 150);
   }