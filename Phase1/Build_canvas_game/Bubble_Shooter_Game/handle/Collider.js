import { gameState } from "../main/index.js";
import { bubble } from "../main/index.js";
import { CircleCollider } from "../model/CircleCollider.js";
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
      let ballRadius = 20;

      gameState.setShoot(true);
      this.speed = 0;
      //this.color === other.color &&
      if (this.isColliding && other.isColliding) {
        let deviationX = this.x - other.x;
        let deviationY = other.y + 40;

        this.y = deviationY;

        let y = other.y;
        let x = other.x;
        const row = Math.floor((y - ballRadius) / (ballRadius * 2));
        const isOdd = row % 2 !== 0;
        const col = Math.floor(
          (x - ballRadius - (isOdd ? ballRadius : 0)) / (ballRadius * 2)
        );

        if (isOdd) {
          this.x = this.x - deviationX - ballRadius;
        } else {
          this.x = this.x - deviationX + ballRadius;
        }
       // if (this.color == other.color) {
          //this.getBubbleAt(row, col, other);
          this.checkMerge(row, col, other);
        //}
        // let bubbleAtPosition = this.getBubbleAt(x, y,ballRadius);
        // console.log(bubbleAtPosition.color);
      }
    }
  }
  checkMerge(row, col, ball) {
    let bubbles = [];
    let visited = new Set();

    this.dfs(row, col, bubbles, visited, ball);
    console.log(bubbles.length);
    
    if (bubbles.length >= 3) {
      console.log("has: " + bubbles.length);
    }
  }
  dfs(row, col, bubbles, visited, ball) {
    const key = `${row},${col}`;
    //console.log(key);

    if (visited.has(key)) return;
    visited.add(key);
   // console.log(visited);

    let currentBubble = this.getBubbleAt(row, col, ball);

    // Nếu không có bóng tại vị trí này, thoát hàm
    if (!currentBubble) return;

    bubbles.push(currentBubble);
   // console.log(currentBubble.color);
    

    const directions = [
      [-1, 0], // Trên
      [1, 0], // Dưới
      [0, -1], // Trái
      [0, 1], // Phải
    ];

    for (const [dx, dy] of directions) {
      this.dfs(row + dx, col + dy, bubbles, visited, ball);
    }
  }

  getBubbleAt(row, col, other) {
    const gridRows = 5; 
    const gridCols = 10; 

    if (row < 0 || row >= gridRows || col < 0 || col >= gridCols) {
      return null; 
    }

    // Logic lấy bóng tại (row, col)
    if (other != undefined) {
      return other;
    }

    return null;
  }

  isValidPosition(row, col) {
    // Thay `gridRows` và `gridCols` bằng số hàng và cột thực tế của lưới
    const gridRows = 4; // Ví dụ: 10 hàng
    const gridCols = 10; // Ví dụ: 10 cột

    return row >= 0 && row < gridRows && col >= 0 && col < gridCols;
  }
}


