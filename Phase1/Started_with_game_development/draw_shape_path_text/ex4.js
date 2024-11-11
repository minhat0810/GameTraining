"use strict";
        let canvas;
        let context;
        let x = 400;
        let y = 300;
        let radius = 100;

        window.onload = init;

        function init() {
            canvas = document.getElementById('canvas');
            context = canvas.getContext('2d');
            drawClockFace();
            drawHourMarkers();
            updateClock();
        }
   function drawClockFace(){
    context.clearRect(0, 0, 800, 600);
        context.beginPath();
        context.arc(x,y,radius,0,2*Math.PI);
        context.stroke();
   }
function drawHourMarkers() {
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6; // Góc của mỗi vạch giờ
      const xOuter = x + radius * Math.cos(angle);
      const yOuter = y + radius * Math.sin(angle);
      const xInner = x + (radius-10) * Math.cos(angle);
      const yInner = y +  (radius-10) * Math.sin(angle);

      context.beginPath();
      context.moveTo(xOuter, yOuter);
      context.lineTo(xInner, yInner);
      context.strokeStyle = '#000000';
      context.lineWidth = 2;
      context.stroke();
    }
  }
function drawHand(angle, length, width) {
    context.beginPath();
    context.lineWidth = width;
    context.lineCap = 'round';
    context.moveTo(x, y);
    context.lineTo(
      x + length * Math.cos(angle),
      y + length * Math.sin(angle)
    );
    context.stroke();
}
function updateClock(){
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();

     // Tính góc cho kim giờ và kim phút
    const hourAngle = ((hours + minutes / 60) * Math.PI) / 6 - Math.PI / 2;
    const minuteAngle = (minutes * Math.PI) / 30 - Math.PI / 2;
       // Xóa nét vẽ cũ và vẽ lại đồng hồ
    context.clearRect(0, 0, 800, 600); // Xóa toàn bộ canvas trước khi vẽ lại
    drawClockFace();   // Vẽ lại mặt đồng hồ
    drawHourMarkers(); // Vẽ lại vạch giờ

    context.strokeStyle = '#000';
    drawHand(hourAngle, radius * 0.7, 3);

     context.strokeStyle = '#000';
    drawHand(minuteAngle, radius * 0.4, 2);
     
    setInterval(updateClock, 1000);

    
}