import { gameState, mapDatas } from "../main/index.js";
import { Ball } from "./Ball.js";
import { CollisionManager } from "../handle/CollisionManager.js";
import { AudioManager } from "../handle/AudioManager.js";
import { LevelManager } from "../handle/LevelManager.js";

// import {} from ""

export class Map {
  constructor(context, ballRadius, collisionManager, canvas) {
    this.context = context;
    this.ballRadius = ballRadius;
    this.collisionManager = collisionManager;
    this.colors = ["red", "blue", "green", "yellow", "purple", "black"];
    this.balls = [];
    this.bullets = [];
    this.canvas = canvas;
    this.redraw = false;
    this.distance = 5;
    this.disconnect = [];
    this.quanKey = 0;
    this.currentLevel = 1;
    this.maxLevel = 10;
    this.isLevelCompleted = false;
    this.transitionAlpha = 0;
    this.isTransitioning = false;
    this.keyImg = new Image();
    this.keyImg.src = "../assets/img/black.png";
  }

  draw(context) {
    this.balls.forEach((ball) => ball.draw(context));
    
    if (this.keyImg.complete) {
      this.context.drawImage(this.keyImg, 350, 7, 30, 30);
     this.context.fillStyle = "black"; 
     this.context.fillText("x", 385, 25, 10);
     this.context.fillText(`${this.quanKey}`, 400, 25, 10);

     this.context.strokeStyle = "black";
     this.context.lineWidth = 2; 

     this.context.beginPath();
     this.context.moveTo(0, 50);
     this.context.lineTo(this.canvas.width, 50); 
     this.context.stroke();
    }
  }

  loadMap() {
    // this.balls = [];
    // this.quanKey = 0;

    this.balls.splice(0, this.balls.length);
    this.balls.length = 0;
    const levelPath = `../assets/levels/level_${this.currentLevel}.json`;
    fetch(levelPath)
      .then((response) => response.json())
      .then((map) => {
        for (let row = 0; row < map.length; row++) {
          for (let col = 0; col < map[row].length; col++) {
            const obj = map[row][col];
            const offsetX = row % 2 === 0 ? 0 : this.ballRadius;
            const x = col * this.ballRadius * 2 + this.ballRadius + offsetX;
            const y = row * this.ballRadius * 2 + this.ballRadius;
            const color = this.colors[obj.colorIndex - 1];

            if (obj.type === "bubble") {
              let ball = new Ball(
                x, 
                y, 
                this.ballRadius, 
                `../assets/img/${color}.png`, 
                color, 
                0, 
                0
              );
              ball.row = row;
              ball.col = col;
              this.collisionManager.addCollider(ball.collider);
              this.balls.push(ball);
            } else if (obj.type == "key") {
              let ball = new Ball(
                x, 
                y, 
                this.ballRadius, 
                "../assets/img/black.png",
                color, 
                0, 
                0
              );
              ball.row = row;
              ball.col = col;
              ball.isKey = true;
              ball.type = "key";
              this.quanKey += 1;
              this.collisionManager.addCollider(ball.collider);
              this.balls.push(ball);
            }
          }
        }
      })
      .catch((error) => console.error("Error loading map:", error));
  }

  shootBullet(deltaTime) {
    this.balls.forEach((bl) => {
      if (bl.speed != 0) {
        bl.updatePosition(deltaTime, this.canvas);
        bl.draw(this.context);
      }
    });
  }

  applyGravity(ball) {
    ball.velocity += this.grativy;

    ball.y += ball.velocity;
  }

  checkWin() {
    if (this.quanKey == 0 && !this.isLevelCompleted) {
      this.balls.forEach((bu) => {
        bu.updateFall(1);
        gameState.setShoot(false);
        let index = this.balls.indexOf(bu);
        if (bu.y >= this.canvas.height) {
          this.balls.splice(index, 1);
          gameState.setShoot(true);
          if (this.balls.length == 0) {
            const levelManager = new LevelManager(this.canvas, this.context);
            // levelManager.level = 3;
            levelManager.increaseLevel();
            gameState.nextLevel(true);
      //      console.log(levelManager.level);
          }
        }
      });

      if (gameState.getLevel() && this.currentLevel < this.maxLevel) {
        // levelManager.drawLevel();
        this.startLevelTransition();
      }
    }
  }

  startLevelTransition() {
    if (!this.isTransitioning) {
      this.isTransitioning = true;
      this.transitionAlpha = 0;
      this.fadeOut();
    }
  }

  fadeOut() {
    if (this.transitionAlpha < 1) {
      this.transitionAlpha += 0.007;
      this.context.fillStyle = `rgba(0, 0, 0, ${this.transitionAlpha})`;
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      requestAnimationFrame(() => this.fadeOut());
    } else {
      gameState.currentLevel += 1;
      this.currentLevel += 1;
      gameState.nextLevel(false);
      this.loadMap();
      this.fadeIn();
    }
  }

  fadeIn() {
    if (this.transitionAlpha > 0) {
      this.transitionAlpha -= 0.007;
      this.context.fillStyle = `rgba(0, 0, 0, ${this.transitionAlpha})`;
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      requestAnimationFrame(() => this.fadeIn());
    } else {
      this.isTransitioning = false;
    }
  }

  bulletFall(deltaTime) {
    this.balls.forEach((bu) => {
      if (bu.isFall) {
        bu.updateFall(deltaTime);
        gameState.setShoot(false);
        let index = this.balls.indexOf(bu);

        if (bu.y >= this.canvas.height) {
          this.balls.splice(index, 1);
          gameState.setShoot(true);
          // this.checkWin(bl);
          if (bu.type == "key") {
            this.quanKey -= 1;
          }
        }
      }
    });
    //  this.checkKey();
    // console.log(this.quanKey);
  }

  checkMerge(
    row,
    col,
    ball,
    //,mapData
    gridRows,
    gridCols,
    deviationX,
    deviationY,
    other
  ) {
    let bubbles = [];
    let visited = new Set();
    let disconnect = [];

    let index = this.balls.indexOf(ball);
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
    this.checkPosition(bubbleLeft,bubbleRight,ball,bubble,deviationX,deviationY);
    
    this.findCluster(
      row,
      col,
      bubbles,
      visited,
      ball,
      gridRows,
      gridCols,
      other
    );

    if (bubbles.length >= 3) {
       const sound = new AudioManager();
       sound.loadSound("broken", "../assets/sound/broken2.wav");
       sound.playSound("broken");
      bubbles.forEach((bu) => {
       
       
        // this.context.save();
        // this.context.translate(bu.x, bu.y);
        // this.context.scale(1.1, 1.1); // Scale lên 1.5 lần
        // this.context.translate(-bu.x, -ball.y);
        // ball.draw(this.context);
        // setTimeout(()=>{
          
        // },50)
        let index = this.balls.indexOf(bu);
        bu.isFall = true;
        this.balls.splice(index, 1);
        this.collisionManager.removeCollider(bu.collider);
        if (bu.type == "key") {
          this.quanKey -= 1;
        }
        this.findDisconnectBubbles(0, 0);
      });
    }
  }

  checkPosition(bubbleLeft,bubbleRight,ball,bubble,deviationX,deviationY) {
    if (!bubbleLeft && !bubbleRight) {
     // console.log(ball);

      if (ball.x - 70 <= 0) {
        ball.col += 1;
        ball.row -= 1;
        ball.y = ball.y - 40;
        if (ball.row % 2 != 0) {
          ball.x = ball.col * this.ballRadius * 2 + this.ballRadius * 2;
        } else {
          ball.x = ball.col * this.ballRadius * 2 + this.ballRadius;
        }
        this.balls.push(ball);
      } else if (ball.x + 80 >= this.canvas.width) {
     //   console.log("hi");
        ball.col -= 1;
        ball.row -= 1;
        ball.y = ball.y - 40;
        if (ball.row % 2 != 0) {
          ball.x = ball.col * this.ballRadius * 2 + this.ballRadius * 2;
        } else {
          ball.x = ball.col * this.ballRadius * 2 + this.ballRadius;
        }
        this.balls.push(ball);
      } else {
        ball.row -= 1;
        ball.y = ball.y - 40;
        ball.col += 1;
        if (ball.row % 2 != 0) {
          ball.x = ball.col * this.ballRadius * 2 + this.ballRadius * 2;
        } else {
          ball.x = ball.col * this.ballRadius * 2 + this.ballRadius;
        }

        this.balls.push(ball);
      }
    } else if (
      bubbleLeft &&
      bubbleRight == undefined
      // || !bubbleLeft && !bubbleRight
    ) {
     // console.log("L1R0");

      if (ball.x - deviationX + 40 + this.ballRadius > this.canvas.width) {
        if (ball.row % 2 == 0) {
          console.log("5");
          ball.x = ball.col * this.ballRadius * 2 + this.ballRadius;
        } else {
          if (bubble) {
            ball.col -= 1;
            ball.x = ball.col * this.ballRadius * 2 + this.ballRadius * 2;
            console.log("L1R0-odd-left");
          } else {
            ball.x = ball.col * this.ballRadius * 2 + this.ballRadius * 2;
          }
        }
      } else {
        ball.y = ball.y - 40;
        ball.x = ball.x - deviationX + 40;
        ball.col += 1;
        ball.row -= 1;
      }

      this.balls.push(ball);
    } else if (
      bubbleRight &&
      bubbleLeft == undefined
      //|| !bubbleLeft && !bubbleRight
    ) {
    //  console.log("L0R1");

      if (ball.x - deviationX - 40 <= 0) {
        if (ball.row % 2 == 0) {
          ball.x = ball.x - deviationX - 20;
        } else {
          console.log("L0R1-odd");
          ball.x = ball.x - deviationX + 20;
        }
      } else {
        ball.y = ball.y - 40;
        ball.x = ball.x - deviationX - 40;
        ball.col -= 1;
        ball.row -= 1;
      }
      this.balls.push(ball);
    } else if (bubbleLeft && bubbleRight) {
      if (bubble != undefined) {
        if (ball.row % 2 == 0) {
      //    console.log("1");

          ball.x = ball.x - deviationX + 20;
          ball.col += 1;
          ball.row += 1;
        } else {
         // console.log("2");

          ball.x = ball.x - deviationX - 20;
          ball.col -= 1;
          ball.row += 1;
        }
      } else {
        if (ball.row % 2 == 0) {
        //  console.log("3");

          ball.x = ball.x - deviationX - 20;
        } else {
          ball.x = ball.x - deviationX + 20;
        }
      }
      this.balls.push(ball);
    }
  }

  findCluster(row, col, bubbles, visited, ball, gridRows, gridCols, other) {
    const key = `${row},${col}`;
    if (row < 0 || col < 0 || visited.has(key)) {
      return;
    }
    

    let currentBubble = this.balls.find((b) => b.row === row && b.col === col);
    if (!currentBubble) return; 

    try {
      if (currentBubble.color !== ball.color && !currentBubble.isKey) {
        return;
      }

      visited.add(key);
      bubbles.push(currentBubble);

      const directions = [
        [-1, 0], // Trên
        [1, 0],  // Dưới
        [0, -1], // Trái
        [0, 1],  // Phải
      ];
      
      if (row % 2 === 0) {
        directions.push(
          [-1, -1], // Trên trái
          [1, -1],  // Dưới trái
        );
      } else {
        directions.push(
          [-1, 1], // Trên phải
          [1, 1]   // Dưới phải
        );
      }

      // Kiểm tra các bóng lân cận
      for (const [dy, dx] of directions) {
        const newRow = row + dy;
        const newCol = col + dx;
        if (newRow >= 0 && newCol >= 0) {
          this.findCluster(newRow, newCol, bubbles, visited, ball, gridRows, gridCols, other);
        }
      }
    } catch (error) {
      console.error("Error in findCluster:", error);
    }
  }

  clusterFall(ball, visited, connectedBubbles) {
    let stack = [ball];
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
      // [-1, -1],
     // [1, 1],
    ];

    while (stack.length > 0) {
      let current = stack.pop();
      let key = `${current.row},${current.col}`;

      if (visited.has(key)) continue;

      visited.add(key);
      connectedBubbles.push(current);

      for (const [dx, dy] of directions) {
        let neighbor = this.balls.find(
          (b) => b.row === current.row + dy && b.col === current.col + dx
        );
        if (neighbor && !visited.has(`${neighbor.row},${neighbor.col}`)) {
          stack.push(neighbor);
        }
      }
    }
  }

  findDisconnectBubbles(row, col) {
    if (row >= 20 || row < 0) return;

    let visited = new Set();
    let connectedBubbles = [];

    for (let ball of this.balls) {
      if (ball.row === 0) {
        this.clusterFall(ball, visited, connectedBubbles);
      }
    }

    let disconnectedBubbles = this.balls.filter(
      (ball) => !visited.has(`${ball.row},${ball.col}`)
    );

    disconnectedBubbles.forEach((ball) => {
      ball.isFall = true;
    });

    // return this.findDisconnectBubbles(row + 1, col);
  }
}
