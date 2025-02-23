  import { Shooter } from "../model/Shooter.js";
import { Draw } from "../model/Draw.js";
import { InputController } from "../handle/InputController.js";
import { BallPrediction } from "../model/BallPrediction.js";
import { Ball } from "../model/Ball.js";
import { CollisionManager } from "../handle/CollisionManager.js"
import { Map } from "../model/Map.js";
import { LevelManager } from "../handle/LevelManager.js";
// import { GameMenu } from "../model/GameMenu.js";
import { GameManager } from "../handle/GameManager.js";
import { AudioManager } from "../handle/AudioManager.js";

const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");


const circles = [];
let mouseX = 0;
let mouseY = 0;
let level1 = "../assets/levels/level_1.json";
let imgPlayer = "../assets/img/Player/lazy.png";
let imgBall1  = "../assets/img/red.png";
let imgBall2 = "../assets/img/blue.png";
let imgBall3 = "../assets/img/green.png";
let imgBall4 = "../assets/img/purple.png";
let imgBall5 = "../assets/img/yellow.png";
const ballRadius = 20;
const colors = ["red", "blue", "green", "yellow", "purple"];
let shooting;
let predictBullet;
//let bullet;
let bullets = [];
let mapLoaded = false;
let firstShoot = true;
let bubbles = [];
let mapData = [];
let dream = "../assets/img/dreamball.png";
let firstDrawMap = true;
let deltaTime;
let disconnectBubble = [];
const bgImage = new Image();
bgImage.src = "../assets/img/bgr.jpg"; 

// bgImage.onload = function () {
//   context.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
// };

export const gameState = {
  isShoot: false,
  isFall: false,
  timesShoot: 0,
  levelCompleted: false,
  setShoot(value) {
    this.isShoot = value;
  },
  getImg(){
    return imgBall1;
  },
  getShoot() {
    return this.isShoot;
  },
  updateTimes(){
    this.timesShoot += 1;
  },
  times(){
     return this.timesShoot;
  },
  timesReset(){
    this.timesShoot = 0;
  },
  nextLevel(value){
    this.levelCompleted = value;
  },
  getLevel(){
    return this.levelCompleted;
  }
};

export const mapDatas = {
  setMapData(val){
      mapData = val;
  },
  getMapData(){
    return mapData;
  }
}

let firstBall = getRandomColor();

export const nextBullet = {
  predictBullet: firstBall,
  setBullet(value){
    this.predictBullet = value;
  },
   getBullet() {
    return this.predictBullet;
  },
}

const queue = new BallPrediction();
const shoot = new Shooter(canvas.width / 2 - 50,canvas.height - 60,100,80,350,imgPlayer);
const collisionManager = new CollisionManager();
const map = new Map(context, ballRadius, collisionManager, canvas);
const inputController = new InputController(canvas, updateRotationToMouse, shoot,queue,getRandomColor,collisionManager,map);
const drawShoot = new Draw(context,shoot);
const drawMap = new Draw(context,map,ballRadius,collisionManager);
const lazy = new Shooter(160, canvas.height - 120, 100, 80, 350, dream);
let first = new Ball(210, 570, 10, 0, firstBall, 0, 0, map.checkMerge.bind(map));
const levelManager = new LevelManager(canvas,context);
const gameManager = new GameManager(canvas, context);
//const gameMenu = new GameMenu(canvas, context);

queue.enqueue(firstBall);

// if (!mapLoaded) {
  map.loadMap();
//   mapLoaded = true;
// }

function updateRotationToMouse(event) {
  mouseX = event.clientX - canvas.offsetLeft;
  mouseY = event.clientY - canvas.offsetTop;

  return {x: mouseX , y: mouseY}
} 

function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

function drawHUD(context, score, health) {
  context.fillStyle = "red";
  context.font = "20px Arial";
  context.fillText(`Score: ${score}`, 10, 20);
  context.fillText(`Health: ${health}`, 10, 40);
}

let lastTime = 0;
function gameLoop(timeStamp) {
  deltaTime = (timeStamp - lastTime) / 1000;
  lastTime = timeStamp;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

  if (!gameManager.isGameStarted()) {
    gameManager.draw();
  } else {
    if (gameState.getLevel()) {
       levelManager.increaseLevel();
       levelManager.drawLevel();
    } else {
      context.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    }
     drawShoot.drawShooter(shoot);
    if (gameState.getShoot(true)) {
      drawShoot.drawPrediction(shoot, mouseX, mouseY, canvas, ballRadius);
    }
   
    drawShoot.drawShooter(lazy);
    if (firstShoot) {
      first.draw(context);
    }
    
    map.shootBullet(deltaTime);
    map.draw(context);
    map.bulletFall(deltaTime);
    setTimeout(() => {
      map.checkWin();
    }, 1000);
    predictBullet = nextBullet.getBullet();
    if (predictBullet instanceof Ball) {
      predictBullet.draw(context);
      firstShoot = false;
    }
    canvas.addEventListener("press", (e)=>{

    })
    collisionManager.checkCollisions();
    // if(levelManager.level > 2){
    //   gameManager.gameStarted = false;
    //   gameManager.show()
    // }
  }

  requestAnimationFrame(gameLoop);
}
gameLoop();
