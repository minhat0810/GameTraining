import { Ball } from "../model/Ball.js";
import { gameState } from "../main/index.js";
import { nextBullet } from "../main/index.js";
import { Shooter } from "../model/Shooter.js";
import { CollisionManager } from "./CollisionManager.js";

export class InputController {
  constructor(canvas, updateRotationToMouse,shoot,queue,getRandomColor,collisionManager,map) {
    this.canvas = canvas;
    this.updateRotationToMouse = updateRotationToMouse;
    this.mouseX = 0;
    this.mouseY = 0;
   // this.isShoot = isShoot;
    this.shoot = shoot;
    this.queue = queue;
 //   this.shooting = shooting;
    this.getRandomColor = getRandomColor;
   // this.predictBullet = predictBullet;
  //  this.shootBullet = shootBullet;
   // this.bullets = bullets;
    this.keys = {};
    this.bullets = [];
    this.collisionManager = collisionManager;
    this.map = map;

    window.addEventListener("keydown", (e) => (this.keys[e.key] = true));
    window.addEventListener("keyup", (e) => (this.keys[e.key] = false));

     window.addEventListener("mousemove", (e) => this.updateRotationToMouse(e));

    window.addEventListener("click", (e) => {
    if (gameState.getShoot()) { 
        this.shooting = this.queue.dequeue();
        const nextBall = this.getRandomColor();
        this.queue.enqueue(nextBall);

        const predictBullet = new Ball(280, 610, 10, 0, queue.front(), 0, 0, () => console.log(123141423));
        nextBullet.setBullet(predictBullet); 

        // const bullet = this.shootBullet(this.shooting);
        this.shootBullet(this.shooting,shoot,canvas,this.ballRadius,e);
       // gameState.setShoot(false); 
      }
    });
      
  }

  isKeyPressed(key) {
    return this.keys[key] || false;
  }

  getMouseX() {
    return this.mouseX;
  }

  getMouseY() {
    return this.mouseY;
  }
  shootBullet(color,shoot,canvas,ballRadius,event) {
    const angle = shoot.calculateAngleToMouse(event.clientX - canvas.offsetLeft,event.clientY - canvas.offsetTop); 
    //console.log(event.clientX - canvas.offsetLeft,event.clientY - canvas.offsetTop);
    
    let bullet = new Ball(canvas.width / 2,canvas.height - 60,20,null,color,1000,angle,this.map.checkMerge.bind(this.map));

    //console.log(bullet);
    
    
    this.collisionManager.addCollider(bullet.collider);
  //  this.bullets.push(bullet);
    //    // console.log(this.bullets);
    // // return bullet;
    // for (const bullet in this.bullets) {
    //  //console.log(bullet);
    //   bullet.upda
    // }
    gameState.setBullet(bullet);
   // console.log(gameState.getBullet());
    
  } 
  // drawBullet(context){
  //   this.bullets.forEach(bullet => bullet.drawBullet(context));
  // }
  
  // updateRotationToMouse(event) {
  //   mouseX = event.clientX - canvas.offsetLeft;
  //   mouseY = event.clientY - canvas.offsetTop;
  // }
}


