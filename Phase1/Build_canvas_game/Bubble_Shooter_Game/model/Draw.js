export class Draw {
  constructor(context) {
    this.context = context;
  }

  drawShooter(shooter) {
    if (shooter.imgPlayerR && shooter.imgPlayerR.complete) {
      this.context.drawImage(
        shooter.imgPlayerR,
        shooter.x,
        shooter.y,
        shooter.width,
        shooter.height
      );
    } else {
      this.context.fillStyle = "white";
      this.context.fillRect(
        shooter.x,
        shooter.y,
        shooter.width,
        shooter.height
      );
    }
  }

  drawPrediction(shooter, mouseX, mouseY,canvas,ballRadius) {
    const points = shooter.calculatePrediction(mouseX, mouseY,canvas,ballRadius); 

    this.context.save();
    this.context.beginPath();
    this.context.moveTo(shooter.x + shooter.width / 2, shooter.y);

    for (const point of points) {
      this.context.lineTo(point.x, point.y); 
    }

    this.context.lineWidth = 2;
    this.context.setLineDash([5, 5]);
    this.context.stroke();
    this.context.restore();
  }

  drawBullet(bullet){
    if (this.image) {
      context.drawImage(
        this.image,
        this.x - this.radius,
        this.y - this.radius,
        this.radius * 2,
        this.radius * 2
      );
    } else {
      context.beginPath();
      context.arc(this.x, this.y + this.radius, this.radius, 0, 2 * Math.PI);
      context.fillStyle = this.color; // Dùng màu sắc được truyền vào
      context.fill();
      context.lineWidth = 2; // Độ dày của viền
      context.strokeStyle = "black"; // Màu viền
      context.stroke();
    }
  }
}
