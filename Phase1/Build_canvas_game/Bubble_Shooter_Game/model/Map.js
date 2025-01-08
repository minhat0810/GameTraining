import { bubble, gameState, mapDatas } from "../main/index.js";
import { Ball } from "./Ball.js";
import { CollisionManager } from "../handle/CollisionManager.js";



export class Map {
  constructor(context, ballRadius, collisionManager, canvas) {
    this.context = context;
    this.ballRadius = ballRadius;
    this.collisionManager = collisionManager;
    this.colors = ["red", "blue", "green", "yellow", "purple"];
    this.mapData = [];
    this.canvas = canvas;
    this.redraw = false;
      //  console.log(this.mapData);
  }

  loadMap() {
    fetch("../assets/levels/level_1.json")
      .then((response) => response.json()) // Chuyển đổi dữ liệu JSON
      .then((data) => {
        this.mapData = data;
          this.drawMap(this.mapData, this.ballRadius); // Vẽ map từ dữ liệu JSON
      })
      .catch((error) => console.error("Error loading map:", error));
  }

  // Vẽ map từ dữ liệu JSON
  drawMap(mapData, ballRadius) {
    for (let row = 0; row < this.mapData.length; row++) {
      for (let col = 0; col < this.mapData[row].length; col++) {
        const obj = mapData[row][col];
        const offsetX = row % 2 === 0 ? 0 : ballRadius; // Dịch ngang cho hàng lẻ
        const x = col * ballRadius * 2 + ballRadius + offsetX;
        const y = row * ballRadius * 2 + ballRadius;
        const color = this.colors[obj.colorIndex - 1]; // Lấy màu từ mảng colors

        // Vẽ đối tượng tùy theo type
        if (obj.type === "bubble") {
          let circle = new Ball(x,y,ballRadius,null,color,0,0,this.checkMerge.bind(this));
          circle.row = row;
          circle.col = col;
          bubble.addBubbles(circle);
          // console.log(circle.row);

          mapDatas.setMapData(this.mapData);
          this.collisionManager.addCollider(circle.collider);

          bubble.remove(1, 1);
        } else if (obj.type === "empty") {
          continue;
        }
      }
    }
  }
  checkMerge(row, col, ball, mapData, gridRows, gridCols) {
    let bubbles = [];
    let visited = new Set();

    bubbles.push(ball);
    this.dfs(row, col, bubbles, visited, ball, gridRows, gridCols, mapData);

    if (bubbles.length >= 3) {
      console.log("has: " + bubbles.length);
      console.log(this.mapData);

    }
  }

  dfs(row, col, bubbles, visited, ball, gridRows, gridCols, mapData) {
    const key = `${row},${col}`;

    if (
      row < 0 ||
      row >= gridRows ||
      col < 0 ||
      col >= gridCols ||
      visited.has(key)
    ) {
      return;
    }

    let currentBubble = mapData[row][col];

    let currentBubbleColor = this.colors[mapData[row][col].colorIndex - 1];

    if (currentBubbleColor !== ball.color) {
      return;
    }

    visited.add(key);

    this.mapData[row][col].type = "empty";
    bubbles.push(currentBubble);

    const directions = [
      [-1, 0], // Trên
      [1, 0], // Dưới
      [0, -1], // Trái
      [0, 1], // Phải
    ];

    for (const [dx, dy] of directions) {
      this.dfs(
        row + dx,
        col + dy,
        bubbles,
        visited,
        ball,
        gridRows,
        gridCols,
        mapData
      );
    }
  }
}

