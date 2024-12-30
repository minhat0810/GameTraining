import { CircleCollider } from "../model/CircleCollider.js";

export class InputController {
  constructor(canvas, updateRotationToMouse,isShoot,queue,shooting,getRandomColor,predictBullet,shootBullet) {
    this.canvas = canvas;
    this.updateRotationToMouse = updateRotationToMouse;
    this.mouseX = 0;
    this.mouseY = 0;
    this.isShoot = isShoot;
    this.queue = queue;
    this.shooting = shooting;
    this.getRandomColor = getRandomColor;
    this.predictBullet = predictBullet;
    this.shootBullet = shootBullet;
   // this.bullets = bullets;
    this.keys = {};

    window.addEventListener("keydown", (e) => (this.keys[e.key] = true));
    window.addEventListener("keyup", (e) => (this.keys[e.key] = false));

    // Make sure 'this.canvas' is available before using it
    // window.addEventListener("mousemove", (e) => {
    //   // if (this.canvas) {
    //   updateRotationToMouse(e);
    //   //}
    // });

     window.addEventListener("mousemove", (e) => this.updateRotationToMouse(e));

    window.addEventListener("click", (e) => {
      if (this.isShoot) {
        shooting = queue.dequeue(); // Lấy và xóa quả bóng đầu tiên
        const nextBall = this.getRandomColor();
        queue.enqueue(nextBall);
        //console.log(shooting);
        
        predictBullet = new CircleCollider(280, 610, 10, 0, queue.front(), 0);

         shootBullet(shooting);
         //console.log(bullet);
         
      //   this.isShoot = false;
         //console.log(isShoot);
         
        // collis = false;
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


