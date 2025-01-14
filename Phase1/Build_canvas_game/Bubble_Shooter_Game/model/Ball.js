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
    onCollideCorrectColor
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
    if (imageSrc) {
      this.image = new Image();
      this.image.src = imageSrc;
    }

    this.x = x;
    this.y = y;
    
  }

  pushBubble(bubble){
    this.bubbles.push(bubble);
  }

  getListBubble(){
        return bubbles;
  };

  draw(context) {
    if (this.image) {
      context.drawImage(
        this.image,
        this.x - this.radius,
        this.y + this.radius,
        this.radius * 2,
        this.radius * 2
      );
    } else {
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
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
      gameState.setShoot(true);
    }

    return { y: this.y };
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
    //console.log(this.bubbles);
    
    
    gameState.setShoot(true);
    //const list = bubble.getListBubble();
    this.speed = 0;
    //this.color === other.color &&
    if (this.collider.isColliding && otherCollider.isColliding) {
      
      // console.log(mapData);
      let deviationX = this.x - otherCollider.x;
      let deviationY = otherCollider.y + 40;
      this.y = deviationY;
      let y = otherCollider.y;
      let x = otherCollider.x;
      let gridRows = 5;
      let gridCols = 10;
      


      const row = Math.floor((y - ballRadius) / (ballRadius * 2));
      const isOdd = row % 2 !== 0;
      const col = Math.floor((x - ballRadius - (isOdd ? ballRadius : 0)) / (ballRadius * 2));
      this.row = row;
      this.col = col;

      console.log(this.row , this.col);
      
      if (isOdd) {
        this.x = this.x - deviationX - ballRadius;
      } else {
        this.x = this.x - deviationX + ballRadius;
      }
 //     if (this.color == otherCollider.ball.color) {
    //    console.log(mapDatas.getMapData());
         //  console.log(otherCollider);
        
         this.onCollideCorrectColor?.(row,col,this,mapDatas.getMapData(),gridRows,gridCols);
        //console.log(this.y);
       //  this.onCollideCorrectColor?.(row,col,this,this.bubbles,gridRows,gridCols);
    //  }
      // let bubbleAtPosition = this.getBubbleAt(x, y,ballRadius);
      // console.log(bubbleAtPosition.color);
    }
  }

}

 
 