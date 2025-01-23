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
    this.distance = 5;
    this.disconnect = [];
  }

  draw(context) {
    this.balls.forEach((ball) => ball.draw(context));
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
              let ball = new Ball(x, y, this.ballRadius, null, color, 0, 0);
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

  // updateBallPositions() {
  //   for (let i = 1; i < this.balls.length; i++) {
  //     this.balls[i].x =
  //       this.balls[i - 1].x + this.balls[i - 1].radius * 2 + this.distance; // Cập nhật vị trí x với khoảng cách
  //   }
  // }
  checkMerge(row, col, ball, mapData, gridRows, gridCols,deviationX,deviationY) {
    let bubbles = [];
    let visited = new Set();
    let disconnect = [];

   // console.log(deviationX,deviationY);


   
    let bubble = this.balls.find((bubble) => bubble.col == col && bubble.row == row+1)

    let bubbleRight = this.balls.find((bubble) => bubble.col+1 == col && bubble.row == row+1)
    let bubbleLeft = this.balls.find((bubble) => bubble.col-1 == col && bubble.row == row+1)
    
        if (bubble != undefined) {
              //console.log("yes");
          if (ball.row % 2 == 0) {
              //  if(bubbleLeft == undefined){
              ball.x = ball.x - deviationX + 20;
              ball.col += 1;
              //    console.log(bubbleLeft);
              //  }else{
              //     ball.y = ball.y - 40;
              //  } 
          } else {        
              //    if(bubbleRight == undefined){
              ball.x = ball.x - deviationX - 20;
              ball.col -= 1;
              //   console.log(bubbleRight); 
              // } else {
              //   ball.y = ball.y - 40;
              // }
              // console.log(ball.x - deviationX + 20);
          }
        } else {
         // console.log("no");
          if (ball.row % 2 == 0) {
            ball.x = ball.x - deviationX - 20;
          } else {
            ball.x = ball.x - deviationX + 20;
          }
        }

   
    

    this.balls.push(ball);
    bubbles.push(ball);

    console.log(bubbles);
    
    

    this.findCluster(row,col,bubbles,visited,ball,gridRows,gridCols,mapData);

    if (bubbles.length >= 3) {
      bubbles.forEach((bu) => {
        let index = this.balls.indexOf(bu);
        this.balls.splice(index, 1);
        this.collisionManager.removeCollider(bu.collider);
        //       console.log(bu.row, bu.col);
        this.findDisconnectBubbles(mapData, bu.row, bu.col, disconnect);
      });

      //  this.findDisconnectBubbles(mapData)
      let indexBall = gameState.getBullet().indexOf(ball);
      gameState.getBullet().splice(indexBall, 1);
    }
  }

  findCluster(row, col, bubbles, visited, ball, gridRows, gridCols, mapData) {
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

    let currentBubble = this.balls.find((b) => b.row === row && b.col === col);

    //  mapData[row][col+1].type == 'empty' ||
   //console.log(this.balls[row][col]);
   
    try {
        if (currentBubble.color !== ball.color) {
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
              this.findCluster(
                row + dy,
                col + dx,
                bubbles,
                visited,
                ball,
                gridRows,
                gridCols,
                mapData
              );
            }

    } catch (error) {
      
    }
    
    

  //  let currentBubbleColor = this.colors[mapData[row][col].colorIndex - 1];
    // let currentBubbleColor = this.balls.find((b) => b.color);

    // if (currentBubbleColor !== ball.color) {
    //   return;
    // }

    // visited.add(key);

    // mapData[row][col].type = "empty";
    // bubbles.push(currentBubble);

    // const directions = [
    //   [-1, 0], // Trên
    //   [1, 0], // Dưới
    //   [0, -1], // Trái
    //   [0, 1], // Phải
    // ];

    // for (const [dx, dy] of directions) {
    //   this.findCluster(
    //     row + dy,
    //     col + dx,
    //     bubbles,
    //     visited,
    //     ball,
    //     gridRows,
    //     gridCols,
    //     mapData
    //   );
    // }
  }

  findDisconnectBubbles(mapData, row, col, disconnect) {
    if (row >= mapData.length || row == 0) return;
    // console.log(this.balls);
    

    //console.log(mapData[row][col].type);
    //console.log(mapData[row][col].type);
    // if (mapData[row - 1][col].type == "empty") {
    //   let disconnectBubble = this.balls.find(
    //     (b) => b.row === row && b.col === col
    //   );

    //   mapData[row][col].type = "empty";
    //   let index = this.balls.indexOf(disconnectBubble);
    //   if (index != -1) {
    //     // this.balls.splice(index, 1);
    //     // console.log(disconnectBubble.y);
    //     //  disconnectBubble.y += 100;
    //     //    console.log(gameState.getDeltaTime());
    //     gameState.setBubblesFall(disconnectBubble);
    //     //setTimeout(this.balls.splice(index, 1),3000);
    //     //console.log(this.balls);

    //     //    this.collisionManager.removeCollider(disconnectBubble.collider)
    //   }
    //   console.log(index);
    // }

     try {
       let disconnectBubble = this.balls.find(
         (b) => b.row === row && b.col === col
       );

       if(disconnectBubble != undefined){
       // console.log(disconnectBubble);
         gameState.setBubblesFall(disconnectBubble);
       }
     } catch (error) {
      
     }
      

    return this.findDisconnectBubbles(mapData, row + 1, col);
  }
}

  
