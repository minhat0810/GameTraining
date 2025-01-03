  import { Shooter } from "../model/Shooter.js";
  import { Draw } from "../model/Draw.js";
  import { InputController } from "../handle/InputController.js";
  import { BallPrediction } from "../model/BallPrediction.js";
  import { CircleCollider } from "../model/CircleCollider.js";
  import { CollisionManager } from "../handle/CollisionManager.js"
  import { Map } from "../model/Map.js";

  const canvas = document.getElementById("gameCanvas");
  const context = canvas.getContext("2d");

  const circles = [];
  let mouseX = 0;
  let mouseY = 0;
  let level1 = "../assets/levels/level_1.json";
  let imgPlayer = "../assets/img/Player/pika_lazy.png";
  const ballRadius = 20;
  let isShoot = true;
  const colors = ["red", "blue", "green", "yellow", "purple"];
  let shooting;
  let predictBullet;
  let bullet;
  let bullets = [];
  let mapLoaded = false;
  let firstShoot = true;
  let bubbles = [];
  let dream = "../assets/img/Player/dream.png";

    export const gameState = {
      isShoot: true,

      setShoot(value) {
        this.isShoot = value;
      },

      getShoot() {
        return this.isShoot;
      },
      getGrid() {
        return bubbles; // Trả về lưới bóng
      },
    };

    export const bubble = {
      addBubbles(obj){
        bubbles.push(obj);
      },
      removeBubble(bubble) {
        // const index = this.bubbles.indexOf(bubble);
        // if (index > -1) {
        //   this.bubbles.splice(index, 1);
        // }
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
  const inputController = new InputController(canvas, updateRotationToMouse,queue,shooting,getRandomColor,shootBullet);
  const collisionManager = new CollisionManager();
  const shoot = new Shooter(canvas.width / 2 - 50,canvas.height - 60,100,80,350,imgPlayer);
  const drawShoot = new Draw(context,shoot);
  
  const map = new Map(context,ballRadius,collisionManager);
 // const map = new Map(4, 10);
  const drawMap = new Draw(context,map,ballRadius,collisionManager);
  const lazy = new Shooter(230, canvas.height - 110, 100, 80, 350, dream);
  let first = new CircleCollider(280, 610, 10, 0, firstBall, 0);
 
    queue.enqueue(firstBall);



  // const predictBullet = nextBullet.getBullet();
  // console.log(predictBullet);
  


  function updateRotationToMouse(event) {
    mouseX = event.clientX - canvas.offsetLeft;
    mouseY = event.clientY - canvas.offsetTop;
  }

  //const getBullets = () => bullets;

  function shootBullet(color) {

    //if (!isShoot) return;
    
    const angle = shoot.calculateAngleToMouse(mouseX,mouseY); // Tính toán góc bắn
   // console.log(angle);
    
    bullet = new CircleCollider(canvas.width / 2,canvas.height - 80,ballRadius,null,color,800,angle,isShoot);
    collisionManager.addCollider(bullet);
    bullets.push(bullet);

    // isShoot = false;
    //console.log(isShoot);
    
    

    return bullet;
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
    const deltaTime = (timeStamp - lastTime) / 1000;
    lastTime = timeStamp;


    context.clearRect(0, 0, canvas.width, canvas.height);
    
   // drawMap.drawGrid(40,level1,ballRadius);
    if(firstShoot){
      first.draw(context);
    }
     if (!mapLoaded) {
       map.loadMap();
       mapLoaded = true; 
     }
    drawShoot.drawShooter(shoot);
    drawShoot.drawShooter(lazy);
    if(gameState.getShoot(true)){
       drawShoot.drawPrediction(shoot, mouseX, mouseY, canvas, ballRadius);
    }
    
    for (const bullet of bullets) {
      bullet.updatePosition(deltaTime,canvas,isShoot); // Cập nhật vị trí viên đạn
      bullet.draw(context);
      
      // if (bullet.y < -bullet.radius) {
      //   bullets.splice(bullet, 1);
      //   collisionManager.addCollider(bullet);
      //   collisionManager.removeCollider(bullet);
      // }
    }
     for (const bubbleObj of bubbles) {
        bubbleObj.draw(context); 
    //    console.log(bubbleObj);
        
     }
   // predictBullet.draw(context);
    predictBullet = nextBullet.getBullet();
    
    if (predictBullet instanceof CircleCollider) {
      predictBullet.draw(context);
      firstShoot = false;
    }
    // if (predictBullet) {
    //   // Thực hiện các hành động với viên đạn dự đoán
    //   predictBullet.updatePosition(deltaTime, canvas, isShoot);
    //   predictBullet.draw(context);
    // }
    
    collisionManager.checkCollisions();
    requestAnimationFrame(gameLoop);
  }
  gameLoop();
