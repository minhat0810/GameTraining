import { Ball } from "../model/Ball.js";
import { gameState } from "../main/index.js";
import { nextBullet } from "../main/index.js";

export class InputController {
  constructor(canvas, updateRotationToMouse,queue,shooting,getRandomColor,shootBullet) {
    this.canvas = canvas;
    this.updateRotationToMouse = updateRotationToMouse;
    this.mouseX = 0;
    this.mouseY = 0;
   // this.isShoot = isShoot;
    this.queue = queue;
    this.shooting = shooting;
    this.getRandomColor = getRandomColor;
   // this.predictBullet = predictBullet;
    this.shootBullet = shootBullet;
   // this.bullets = bullets;
    this.keys = {};

    window.addEventListener("keydown", (e) => (this.keys[e.key] = true));
    window.addEventListener("keyup", (e) => (this.keys[e.key] = false));

     window.addEventListener("mousemove", (e) => this.updateRotationToMouse(e));

    window.addEventListener("click", (e) => {
    if (gameState.getShoot()) { // Kiểm tra trạng thái từ gameState
        this.shooting = this.queue.dequeue();
        const nextBall = this.getRandomColor();
        this.queue.enqueue(nextBall);

        const predictBullet = new Ball(280, 610, 10, 0, queue.front(), 0, 0, () => console.log(123141423));
        nextBullet.setBullet(predictBullet); 

        const bullet = this.shootBullet(this.shooting);
        gameState.setShoot(false); // Đặt lại trạng thái
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
  
}


