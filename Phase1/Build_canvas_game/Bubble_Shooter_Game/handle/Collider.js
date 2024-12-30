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
    // this.isColliding = true;
    //console.log(other);

    this.speed = 0;
    console.log(this);
    
    // if (!this.hasMoved) {
    // //  other.y +=
    //   this.hasMoved = true; // Đánh dấu đối tượng đã di chuyển

    // }
    //this.y += 3;
   // console.log(other.speed);
   // console.log(this.y);
    

    // // for (const circle of circles) {
    // //   if (circle.checkCollision(bullet)) {

    // //     //circle.y -= 2;
    // //     //console.log(circle.color);
    // //     console.log(circle.color);
    // //   }

    // // //  console.log(bullet.isColliding);
    // // }

    // collis = true;
    // isShoot = true;
    // console.log(isShoot);
   // console.log("hi");
    
  }
}


