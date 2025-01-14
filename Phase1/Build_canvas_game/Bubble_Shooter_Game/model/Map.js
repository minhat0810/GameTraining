import {  gameState, mapDatas } from "../main/index.js";
import { Ball } from "./Ball.js";
import { CollisionManager } from "../handle/CollisionManager.js";



export class Map {
  constructor(context, ballRadius, collisionManager, canvas) {
    this.context = context;
    this.ballRadius = ballRadius;
    this.collisionManager = collisionManager;
    this.colors = ["red", "blue", "green", "yellow", "purple"];
    this.balls = [];
    this.canvas = canvas;
    this.redraw = false;
     
  }

  draw(context) {
    this.balls.forEach(ball => ball.draw(context))
  }

  drawBullet(){
    th
  }

  loadMap() {
    fetch("../assets/levels/level_1.json")
      .then((response) => response.json()) // Chuyển đổi dữ liệu JSON
      .then((map) => {
            for (let row = 0; row < map.length; row++) {
              for (let col = 0; col < map[row].length; col++) {
                // console.log(map);

                const obj = map[row][col];
                const offsetX = row % 2 === 0 ? 0 : this.ballRadius; // Dịch ngang cho hàng lẻ
                const x = col * this.ballRadius * 2 + this.ballRadius + offsetX;
                const y = row * this.ballRadius * 2 + this.ballRadius;
                const color = this.colors[obj.colorIndex - 1]; // Lấy màu từ mảng colors

                // Vẽ đối tượng tùy theo type
                if (obj.type === "bubble") {
                  let ball = new Ball(x,y,this.ballRadius,null,color,0,0
                  );
                  ball.row = row;
                  ball.col = col;
                  this.collisionManager.addCollider(ball.collider);

                  this.balls.push(ball);                  
                  
                } else if (obj.type === "empty") {
                  continue;
                }
              }
            }
        // this.setMap(data);
        //  console.log(this.getMap());
         mapDatas.setMapData(map);
      })
      .catch((error) => console.error("Error loading map:", error));
  }
  
  checkMerge(row, col, ball, mapData, gridRows, gridCols) {
    let bubbles = [];
    let visited = new Set();

    this.balls.push(ball);
    bubbles.push(ball);

    

    
    this.dfs(row, col, bubbles, visited, ball, gridRows, gridCols, mapData);

    if (bubbles.length >= 3) {
      
      bubbles.forEach(bu => {
        let index = this.balls.indexOf(bu);    
        this.balls.splice(index,1);       
        this.collisionManager.removeCollider(bu.collider);
      });
      let indexBall = gameState.getBullet().indexOf(ball);
      gameState.getBullet().splice(indexBall, 1);
      console.log(indexBall); 

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

    let currentBubble = this.balls.find(b => b.row === row && b.col === col);
    

    let currentBubbleColor = this.colors[mapData[row][col].colorIndex - 1];


    if (currentBubbleColor !== ball.color) {
      return;
    }

    visited.add(key);

    mapData[row][col].type = "empty";
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

