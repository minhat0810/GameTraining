export class Shooter {
  constructor(x, y, width, height, speed, imageSrc = null) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.imgPlayerR = null;

    if (imageSrc) {
      this.imgPlayerR = new Image();
      this.imgPlayerR.src = imageSrc;
    }
  }

  draw() {
    if (this.imgPlayerR && this.imgPlayerR.complete) {
      context.drawImage(
        this.imgPlayerR,
        this.x,
        this.y,
        this.width,
        this.height
      );
    } else {
      context.fillStyle = "blue";
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  updatePosition() {
    if (inputController.isKeyPressed("ArrowLeft")) {
      this.x -= this.speed;
    }
    if (inputController.isKeyPressed("ArrowRight")) {
      this.x += this.speed;
    }

    this.x = Math.max(0, Math.min(canvas.width - this.width, this.x));
  }
  calculatePrediction(mouseX,mouseY,canvas,ballRadius) {
    const maxDistance = 500; 
    const points = []; 

    let currentX = this.x + this.width / 2; 
    let currentY = this.y;
    

    let dx = mouseX - currentX; 
    let dy = mouseY - currentY;
    
    

    const angle = Math.atan2(dy, dx);

    dx = Math.cos(angle);
    dy = Math.sin(angle);

    let distanceTraveled = 0;
    while (distanceTraveled < maxDistance && currentY < canvas.height) {
      if (
        currentX + dx < ballRadius ||
        currentX + dx > canvas.width - ballRadius
      ) {
        dx = -dx; 
      }
      
      currentX += dx; 
      currentY += dy; 
      distanceTraveled += Math.sqrt(dx * dx + dy * dy);
      points.push({ x: currentX, y: currentY }); 
  
      
    }

    return points;
  }

  drawPrediction(mouseX, mouseY) {
    const points = this.calculatePrediction();
    context.save();
    context.beginPath();
    context.moveTo(this.x + this.width / 2, this.y); // Bắt đầu từ vị trí Shooter

    for (const point of points) {
      context.lineTo(point.x, point.y);
    }

    context.lineWidth = 2;
    context.setLineDash([5, 5]); // Đường nét đứt
    context.stroke();
   // context.restore();
  }

  calculateAngleToMouse(mouseX,mouseY) {
    const dx = mouseX - this.x - this.width / 2;
    const dy = mouseY - this.y;

    return Math.atan2(dy, dx); // Trả về góc giữa Shooter và chuột
  }
}
