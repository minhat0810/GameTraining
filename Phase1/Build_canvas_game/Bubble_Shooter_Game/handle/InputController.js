import { Ball } from "../model/Ball.js";
import { gameState } from "../main/index.js";
import { nextBullet } from "../main/index.js";
import { Shooter } from "../model/Shooter.js";
import { CollisionManager } from "./CollisionManager.js";
import { AudioManager } from "./AudioManager.js";

export class InputController {
  constructor(canvas, updateRotationToMouse, shoot, queue, getRandomColor, collisionManager, map) {
    this.canvas = canvas;
    this.updateRotationToMouse = updateRotationToMouse;
    this.mouseX = 0;
    this.mouseY = 0;
    // this.isShoot = isShoot;
    this.shoot = shoot;
    this.queue = queue;
    // this.shooting = shooting;
    this.getRandomColor = getRandomColor;
    // this.predictBullet = predictBullet;
    // this.shootBullet = shootBullet;
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
        const sound = new AudioManager();
        sound.loadSound('shoot', '../assets/sound/shoot2.wav');
        sound.playSound('shoot')
        let shooting = this.queue.dequeue();
        const nextBall = this.getRandomColor();
        this.queue.enqueue(nextBall);

        const predictBullet = new Ball(
          210, 
          580, 
          10, 
          `../assets/img/${queue.front()}.png`,
          queue.front(), 
          0, 
          0, 
          () => console.log(123141423)
        );
        nextBullet.setBullet(predictBullet); 

        this.shootBullet(shooting, shoot, canvas, this.ballRadius, e);
        gameState.setShoot(false); 
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

  shootBullet(color, shoot, canvas, ballRadius, event) {
    const angle = shoot.calculateAngleToMouse(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop); 

    let bullet = new Ball(
      canvas.width / 2,
      canvas.height - 105,
      17,
      `../assets/img/${color}.png`,
      color,
      1000,
      angle,
      this.map.checkMerge.bind(this.map)
    );
    this.collisionManager.addCollider(bullet.collider);
    
   // gameState.updateTimes();
    
    this.map.balls.push(bullet);
  } 

}
