// import { bubble } from "../main/index.js";
// import { CircleCollider } from "./CircleCollider.js";
// import { CollisionManager } from "../handle/CollisionManager.js";


// export class Map {
//   constructor(context, ballRadius,collisionManager) {
//     this.context = context;
//     this.ballRadius = ballRadius;
//     this.collisionManager = collisionManager;
//     this.colors = ["red", "blue", "green", "yellow", "purple"];
//   }

//   loadMap() {
//     fetch("../assets/levels/level_1.json")
//       .then((response) => response.json()) // Chuyển đổi dữ liệu JSON
//       .then((mapData) => {
//         //   console.log("Map Data: ", mapData);
//         this.drawMap(mapData, this.ballRadius); // Vẽ map từ dữ liệu JSON
//       })
//       .catch((error) => console.error("Error loading map:", error));
//   }

//   // Vẽ map từ dữ liệu JSON
//   drawMap(mapData, ballRadius) {
//     for (let row = 0; row < mapData.length; row++) {
//       for (let col = 0; col < mapData[row].length; col++) {
//         const obj = mapData[row][col];
//         const offsetX = row % 2 === 0 ? 0 : ballRadius; // Dịch ngang cho hàng lẻ
//         const x = col * ballRadius * 2 + ballRadius + offsetX;
//         const y = row * ballRadius * 2 + ballRadius - ballRadius;
//         const color = this.colors[obj.colorIndex - 1]; // Lấy màu từ mảng colors

//         // Vẽ đối tượng tùy theo type
//         if (obj.type === "bubble") {
//           let circle = new CircleCollider(x, y, ballRadius, null, color, 0, 0);
//           bubble.addBubbles(circle);
//           this.collisionManager.addCollider(circle);       
//         }
//       }
//     }
//   }
// //   drawBubble(x, y, radius, color) {
// //     this.context.beginPath();
// //     this.context.arc(x, y, radius, 0, 2 * Math.PI);
// //     this.context.fillStyle = color;
// //     this.context.fill();
// //     this.context.strokeStyle = "black"; // Màu viền
// //     this.context.stroke();
// //     this.context.closePath();
// //   }
// }

export class Map {
  constructor(rows, cols) {
    this.grid = Array.from({ length: rows }, () => Array(cols).fill(null));
  }

  async loadFromJSON(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      this.grid = data;
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu JSON: ", error);
    }
  }

  getBall(x, y) {
    return this.grid[y] && this.grid[y][x];
  }

  removeBall(x, y) {
    this.grid[y][x] = null;
  }
}