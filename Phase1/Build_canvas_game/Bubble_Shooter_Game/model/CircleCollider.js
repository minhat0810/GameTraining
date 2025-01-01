import { gameState } from "../main/index.js";
import { Collider } from "../handle/Collider.js";

export class CircleCollider extends Collider {
  constructor(x,y,radius,imageSrc = null,color = "red",speed,angle) {
    super(x, y);
    this.radius = radius;
    this.speed = speed;
    this.isColliding = false; // Trạng thái va chạm
    this.image = null;
    this.color = color;
    this.angle = angle;
   // this.isShoot = isShoot;

    if (imageSrc) {
      this.image = new Image();
      this.image.src = imageSrc;
    }
  }
  checkCollision(other) {
    if (other instanceof CircleCollider) {
      const dx = this.x - other.x;
      const dy = this.y - other.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < this.radius + other.radius;
    } else if (other instanceof RectCollider) {
      return other.checkCollision(this);
    }
    return false;
  }

  draw(context) {
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

  updatePosition(deltaTime, canvas, isShoot) {
    this.x += Math.cos(this.angle) * this.speed * deltaTime;
    this.y += Math.sin(this.angle) * this.speed * deltaTime; // Di chuyển theo hướng chuột
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.angle = Math.PI - this.angle;
    }
    if (this.y < 0) {
      this.speed = 0;
      this.y = this.y + 2;
      // this.isShoot = false;
      gameState.setShoot(true);
      // console.log(this.isShoot);
    }

    // if(this.y + this.radius >canvas.height || this.y - this.radius <0){
    //      //this.angle = Math.PI - this.angle;
    // }
    return { y: this.y };
  }
}

 
 