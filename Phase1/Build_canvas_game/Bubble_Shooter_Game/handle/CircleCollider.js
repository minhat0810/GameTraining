import { Collider } from "./Collider.js";

export default class CircleCollider extends Collider {
  checkCollision(other) {
    if (other instanceof CircleCollider) {
      const dx = this.x - other.x;
      const dy = this.y - other.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < this.radius + other.radius;
    } 
    // else if (other instanceof RectCollider) {
    //   return other.checkCollision(this);
    // }
    return false;
  }
}