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
// Draw Circle 
   function draw(){
      const barData = [100, 150, 200, 120, 170];

    // Bar properties
    const barWidth = 50;
    const gap = 40;  // Gap between bars

    // Set chart base position
    const baseY = 350;

    // Draw each bar
    barData.forEach((height, index) => {
      // Calculate x position for each bar
      const x = index * (barWidth + gap) + 50;

      // Draw the bar 
      ctx.fillStyle = '#4CAF50';  // Bar color
      ctx.fillRect(x, baseY - height, barWidth, height);

      // Add labels below the bar
      ctx.fillStyle = '#000000';  // Label color
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`Bar ${index + 1}`, x + barWidth / 2, baseY + 20);
    });


   }