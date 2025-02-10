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
    this.bullets = [];
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
    //    mapDatas.setMapData(map);
      })
      .catch((error) => console.error("Error loading map:", error));
  }

  shootBullet(deltaTime) {
    this.balls.forEach((bl) => {
      if (bl.speed != 0) {
        bl.updatePosition(deltaTime, this.canvas);
        bl.draw(this.context);
        //console.log(bl);
      }
    });
  }

  bulletFall(deltaTime) {
    this.balls.forEach((bl) => {
      if (bl.isFall) {
      // console.log(deltaTime); 
       bl.updateFall(deltaTime); 
       gameState.setShoot(false);
       let index = this.balls.indexOf(bl)

        if(bl.y >= this.canvas.height){
         this.balls.splice(index, 1);   
         gameState.setShoot(true);     
        }
       }
    });
  }

  checkMerge(row,col,ball
    //,mapData
    ,gridRows,gridCols,deviationX,deviationY) {
      let bubbles = [];
      let visited = new Set();
      let disconnect = [];

      let index = this.balls.indexOf(ball);
      //  console.log(index);
      this.balls.splice(index);

      let bubble = this.balls.find(
        (bubble) => bubble.col == col && bubble.row == row + 1
      );

      let bubbleRight = this.balls.find(
        (bubble) => bubble.col == col + 1 && bubble.row == row
      );
      let bubbleLeft = this.balls.find(
        (bubble) => bubble.col == col - 1 && bubble.row == row
      );
      if( !bubbleLeft && !bubbleRight ){
      
        console.log(ball);
        
        if(ball.x - 60 <= 0){
          ball.col += 1;
          ball.row -= 1;
          ball.y = ball.y - 40;
          if(ball.row % 2 != 0){
            ball.x = ball.col * this.ballRadius * 2 + this.ballRadius * 2;
          }else {
             ball.x = ball.col * this.ballRadius * 2 + this.ballRadius;
          }
          this.balls.push(ball)
          //console.log(ball);
        } 

         if (ball.x + 40 > this.canvas.width) {
            console.log("hi");
          ball.col -= 1;
          ball.row -= 1;
          ball.y = ball.y - 40;
          if (ball.row % 2 != 0) {
            ball.x = ball.col * this.ballRadius * 2 + this.ballRadius * 2;
          } else {
            ball.x = ball.col * this.ballRadius * 2 + this.ballRadius;
          }
           this.balls.push(ball);
        }

        if(ball.x - 60 > 0 && ball.x + 40 < this.canvas.width){
          console.log(ball);
          ball.row -= 1;
          ball.y = ball.y - 40;
          ball.col += 1;
          if (ball.row % 2 != 0) {
            ball.x = ball.col * this.ballRadius * 2 + this.ballRadius * 2 ;
          } else {
            ball.x = ball.col * this.ballRadius * 2 + this.ballRadius ;
          }
          this.balls.push(ball);
        }
      }
     // console.log(this.balls);
      
      
      if(bubbleLeft && bubbleRight == undefined
        // || !bubbleLeft && !bubbleRight
        ){
        if(ball.x - deviationX + 40 + this.ballRadius> this.canvas.width){
          if(ball.row %2 == 0){
            // ball.x = ball.x - deviationX - 20;
            //if(ball.)
            ball.x = ball.col * this.ballRadius*2 + this.ballRadius;
          } else{
            ball.x = ball.x - deviationX + 20; 
          }    
        } else {
          ball.y = ball.y - 40;
          ball.x = ball.x - deviationX + 40;
          ball.col += 1;
          ball.row -= 1;;
        }

        this.balls.push(ball);

      } else if (bubbleRight && bubbleLeft == undefined 
        //|| !bubbleLeft && !bubbleRight

      ) {

         if(ball.x - deviationX - 40 <= 0){
          if(ball.row %2 == 0){
            //ball.x = ball.x - deviationX - 20;
            // console.log("hi3");
            // console.log(ball);
            // if(ball.col < 0 ){
            //   ball.col = 0;
            //   ball.x = ball.col * this.ballRadius + this.ballRadius*2;
            // } else{
              ball.x = ball.x - deviationX - 20;
          //  }
          } else{
            ball.x = ball.x - deviationX + 20; 

          }    
        } else {
          ball.y = ball.y - 40;
          ball.x = ball.x - deviationX - 40;
          ball.col -= 1;
          ball.row -= 1;
        
         }
         this.balls.push(ball);
      } else if( bubbleLeft && bubbleRight){
          if (bubble != undefined) {
            if (ball.row % 2 == 0) {
              ball.x = ball.x - deviationX + 20;
              ball.col += 1;
              ball.row +=1;
             // console.log(ball);
              
            } else {
              ball.x = ball.x - deviationX - 20;
              ball.col -= 1;
              ball.row += 1;
            }
          } else {
              if (ball.row % 2 == 0) {
                console.log("hi");
                
                ball.x = ball.x - deviationX - 20;
              } else {
                ball.x = ball.x - deviationX + 20;
              }
          }
          this.balls.push(ball);
         // bubbles.push(ball);
      }

      this.findCluster(
        row,
        col,
        bubbles,
        visited,
        ball,
        gridRows,
        gridCols
      );

      console.log(ball);
      
       
      if (bubbles.length >= 3) {
        bubbles.forEach((bu) => {
          let index = this.balls.indexOf(bu);

          let indexBullet = this.bullets.indexOf(bu);

          this.balls.splice(index, 1);
          this.collisionManager.removeCollider(bu.collider);
          this.findDisconnectBubbles(
            bu.row,
            bu.col,
            disconnect
          );
        });
      }

       //  console.log(gameState.times());
        //  if (gameState.times() == 3) {
        //    this.balls.forEach((bl) => {
        //       // console.log(bl.x);
        //        bl.y += 40;
        //        bl.row += 1;
        //    //   console.log(bl.row);
              
        //       gameState.timesReset() 
        //    });
        //    for(let col = 0; col <10; col++){
        //      const x = col * this.ballRadius * 2 + this.ballRadius; 
        //      const y = 20;
        //      const color = this.colors[Math.floor(Math.random()*  this.colors.length)]
        //      let newBall = new Ball(x, y, this.ballRadius, null, color , 0, 0);
        //      newBall.col = col;
        //      newBall.row = 0;
        //      this.collisionManager.addCollider(newBall.collider);
        //      this.balls.push(newBall);
        //      //console.log(this.balls);
             
        //    }
        //   //  this.balls.forEach(bl => {
        //   //   if(bl.row % 2 == 0){
        //   //     bl.x -= 20;
        //   //   } else{
        //   //     bl.x += 20;
        //   //   }
        //   //  })
        //  }
      // console.log(ball);
    }

  findCluster(row, col, bubbles, visited, ball, gridRows, gridCols
    ) {
    const key = `${row},${col}`;

    if (
      row < 0 ||
      // row >= gridRows ||
      col < 0 ||
      // col >= gridCols ||
      visited.has(key)
    ) {
      return;
    }

    let currentBubble = this.balls.find((b) => b.row === row && b.col === col);

    try {
      if (currentBubble.color !== ball.color) {
             
        return;
      }

      visited.add(key);
      bubbles.push(currentBubble);
      const directions = [
        [-1, 0], // Trên
        [1, 0], // Dưới
        [0, -1], // Trái
        [0, 1], // Phải
        // [-1,-1],
        // [-1,1]
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
        );
      }
    } catch (error) {}
  }

  findDisconnectBubbles(
     row, col, disconnect) {
    if (row >= 20  ||
       row < 0) return;

    try {
      let disconnectBubble = this.balls.find(
        (b) => b.row === row+1 && b.col === col
      );
     
      

      if (disconnectBubble != undefined) {
        let index = this.balls.indexOf(disconnectBubble);

      //   console.log(disconnectBubble);

        disconnectBubble.isFall = true;
      }
      // this.balls.forEach(bl => {
      //   // console.log(bl);
        
      // })

    } catch (error) {}

    return this.findDisconnectBubbles(
       row + 1, col);
  }
}

  
