import CircleCollider from "../handle/CircleCollider.js";
import {  gameState, mapDatas } from "../main/index.js";

export class Ball {
  constructor(
    x,
    y,
    radius,
    imageSrc = null,
    color = "red",
    speed,
    angle,
    onCollideCorrectColor,
    type
  ) {
    this.radius = radius;
    this.speed = speed;
    this.isColliding = false; // Trạng thái va chạm
    this.image = null;
    this.color = color;
    this.angle = angle;
    this.collider = new CircleCollider(x, y, this.onCollision.bind(this));
    this.collider.ball = this;
    this.collider.radius = radius;
    this.onCollideCorrectColor = onCollideCorrectColor;
    this.bubbles = [];
    this.isFall  = false;
    this.isKey = false;
    this.type = type;
    this.velocity = 0;
    this.grativy = 0.1;
    if (imageSrc) {
      this.image = new Image();
      this.image.src = imageSrc;
    }

    this.x = x;
    this.y = y;
  }



  draw(context) {
    // console.log(this.image);
    
    if (this.image && this.image.complete) {
      context.drawImage(
        this.image,
        this.x - this.radius,
        this.y + this.radius+10,
        this.radius * 2,
        this.radius * 2
      );
    } else {
      context.beginPath();
      context.arc(this.x, this.y+40, this.radius, 0, 2 * Math.PI);
      context.fillStyle = this.color; // Dùng màu sắc được truyền vào
      context.fill();
      context.lineWidth = 1; // Độ dày của viền
      context.strokeStyle = "black"; // Màu viền
      context.stroke();
    }
  }

  updatePosition(deltaTime, canvas) {
    this.x += Math.cos(this.angle) * this.speed * deltaTime;
    this.y += Math.sin(this.angle) * this.speed * deltaTime;
    
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.angle = Math.PI - this.angle;
    }
    if (this.y < 0) {
      this.speed = 0;
      this.y = this.y + 2;
      gameState.setShoot(true);
    }

    return { y: this.y };
  }

  updateFall(deltaTime){
   // this.y += 1000 * deltaTime * 0.6;
   this.velocity += this.grativy;

   this.y += this.velocity;
  }

  get onCollideCorrectColor() {
    return this._onCollideCorrectColor;
  }

  set onCollideCorrectColor(val) {
    //console.error(typeof val);
    this._onCollideCorrectColor = val;
  }

  get x() {
    return this.collider.x;
  }

  set x(val) {
    this.collider.x = val;
  }

  get y() {
    return this.collider.y;
  }

  set y(val) {
    this.collider.y = val;
  }

  onCollision(otherCollider) {
    let ballRadius = 20;
    gameState.setShoot(true);
    this.speed = 0;
    if (this.collider.isColliding && otherCollider.isColliding) {
      let deviationX = this.x - otherCollider.x;
      let deviationY = otherCollider.y + 40;
      this.y = deviationY;
      let y = otherCollider.y;
      let x = otherCollider.x;
      let gridRows = 5;
      let gridCols = 10;

      const row = Math.floor((y - ballRadius) / (ballRadius * 2));
      
      const isOdd = row % 2 !== 0;
      const col = Math.floor(
        (x - ballRadius - (isOdd ? ballRadius : 0)) / (ballRadius * 2)
      );
      this.row = row+1;
      this.col = col;
      this.radius = 20;
      
      this.onCollideCorrectColor?.(
        row,
        col,
        this,
        gridRows,
        gridCols,
        deviationX,
        deviationY,
        otherCollider,
      );
    }
  }
}

 
 