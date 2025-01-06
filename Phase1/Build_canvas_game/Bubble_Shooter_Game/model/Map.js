import { bubble, gameState, mapDatas } from "../main/index.js";
import { Ball } from "./Ball.js";
import { CollisionManager } from "../handle/CollisionManager.js";



export class Map {
  constructor(context, ballRadius, collisionManager,canvas) {
    this.context = context;
    this.ballRadius = ballRadius;
    this.collisionManager = collisionManager;
    this.colors = ["red", "blue", "green", "yellow", "purple"];
    this.mapData = [];
    this.canvas = canvas;
  }

  loadMap() {
    fetch("../assets/levels/level_1.json")
      .then((response) => response.json()) // Chuyển đổi dữ liệu JSON
      .then((data) => {
        this.mapData = data;
        //   console.log("Map Data: ", mapData);
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
          let circle = new Ball(x, y,ballRadius,null,color, 0,0, this.checkMerge.bind(this));
          bubble.addBubbles(circle);
         // circle.setMapData(mapData);
            mapDatas.setMapData(this.mapData);
       //   console.log(mapData);
        //  mapData[4][0] = 'null'
        // 
          this.collisionManager.addCollider(circle.collider);
     //     console.log(this.mapData);
          
        }else if (obj.type === "empty") {
            continue;
        }
      }
    }
  }

  checkMerge(row, col, ball, mapData, gridRows, gridCols) {
    let bubbles = [];
    let visited = new Set();

    
    this.mapData.splice(1,1);
    
    //gameState.clear();

    //console.log(mapData);
    
     
    this.dfs(row, col, bubbles, visited, ball, gridRows, gridCols);

    

    if (bubbles.length >= 3) {
      console.log("has: " + bubbles.length);
    }
    //return this.mapData[4][0] = 'null';
  }

  dfs(row, col, bubbles, visited, ball, gridRows, gridCols) {
    const key = `${row},${col}`;

    if (visited.has(key)) return;
    visited.add(key);
     

    let currentBubble = this.getBubbleAt(row, col, ball, gridRows, gridCols);

    if (!currentBubble) return;
   
    if (currentBubble.color !== ball.color) {
      return;
    }

    if (!currentBubble) return;

    bubbles.push(currentBubble);


    const directions = [
      [-1, 0], // Trên
      [1, 0], // Dưới
      [0, -1], // Trái
      [0, 1], // Phải
    ];

    for (const [dx, dy] of directions) {
      this.dfs(row + dx, col + dy, bubbles, visited, ball);
    //  console.log(dx,dy);
    }
  }

  getBubbleAt(row, col, other, gridRows, gridCols) {
    if (row < 0 || row >= gridRows || col < 0 || col >= gridCols || gridCols == undefined || gridCols == undefined) {
      return null;
    }
    if (other) {
      return other;
    }

    return null;
  }

  findCluster(startRow, startCol, mapData) {
    const row = mapData.length;
    console.log(row);
  }
  //   drawBubble(x, y, radius, color) {
  //     this.context.beginPath();
  //     this.context.arc(x, y, radius, 0, 2 * Math.PI);
  //     this.context.fillStyle = color;
  //     this.context.fill();
  //     this.context.strokeStyle = "black"; // Màu viền
  //     this.context.stroke();
  //     this.context.closePath();
  //   }

}

