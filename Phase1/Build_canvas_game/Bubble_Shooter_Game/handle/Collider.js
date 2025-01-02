import { gameState } from "../main/index.js";
import { bubble } from "../main/index.js";
export class Collider {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.isColliding = false; // Trạng thái va chạm
    this.hasMoved = false;
  }

  checkCollision(other) {
    throw new Error("checkCollision() must be implemented in a subclass"); 
  }

  onCollision(other) {
     if (!this.isColliding) {
       this.isColliding = true;
      // if(this.isColliding || other.isColliding) return;
       gameState.setShoot(true); 
       this.speed = 0;
       //console.log(this);
       if (this.color === other.color) {
         
       }
     }
  }
}


