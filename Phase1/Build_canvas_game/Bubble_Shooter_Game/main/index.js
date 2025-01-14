  import { Shooter } from "../model/Shooter.js";
  import { Draw } from "../model/Draw.js";
  import { InputController } from "../handle/InputController.js";
  import { BallPrediction } from "../model/BallPrediction.js";
  import { Ball } from "../model/Ball.js";
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
  //let bullet;
  let bullets = [];
  let mapLoaded = false;
  let firstShoot = true;
  let bubbles = [];
  let mapData = [];
  let dream = "../assets/img/Player/dream.png";
  let firstDrawMap = true;
  

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
      setBullet(val){
        bullets.push(val);       
      },
      getBullet(){
        return bullets;
      },
      removeBullet(index){
        bullets.splice(index,1);
      }
    };


    // export const bubble = {
    //   addBubbles(obj){
    //     bubbles.push(obj);
    //   },
    //   getListBubble(){
    //     return bubbles;
    //   },
    //   // clear(){
    //   //   bubbles.splice(0,bubbles.length);
    //   //   bubble.length = 0;
    //   //  // console.log(bubbles);       
    //   // }
    //   remove(index){
    //      bubbles.splice(index,1);
    //   }
    // }

    export const mapDatas = {
      setMapData(val){
          mapData = val;
      },
      getMapData(){
        return mapData;
      }
    }

    // console.log(bubbles);
    // bubbles.splice(4,1)

    
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

 // const map = new Map(4, 10);
  const drawMap = new Draw(context,map,ballRadius,collisionManager);
  const lazy = new Shooter(230, canvas.height - 110, 100, 80, 350, dream);
  let first = new Ball(280, 610, 10, 0, firstBall, 0, 0, map.checkMerge.bind(map));
 // const bullet = new Ball()
  queue.enqueue(firstBall);

 
  if (!mapLoaded) {
    map.loadMap();
    mapLoaded = true;
  }
   

  function updateRotationToMouse(event) {
    mouseX = event.clientX - canvas.offsetLeft;
    mouseY = event.clientY - canvas.offsetTop;

    return {x: mouseX , y: mouseY}
  }

  //const getBullets = () => bullets;

  // function shootBullet(color) {
  //   const angle = shoot.calculateAngleToMouse(mouseX,mouseY); 
  //   bullet = new Ball(canvas.width / 2,canvas.height - 80,ballRadius,null,color,800,angle, map.checkMerge.bind(map));
  //   collisionManager.addCollider(bullet.collider);
  //   bullets.push(bullet);

  //   return bullet;
  // } 


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

    if(firstShoot){
      first.draw(context);
    }
     
    drawShoot.drawShooter(shoot);
    drawShoot.drawShooter(lazy);
    if(gameState.getShoot(true)){
       drawShoot.drawPrediction(shoot, mouseX, mouseY, canvas, ballRadius);
    }
   
    //console.log(gameState.getBullet());
    
    
   // console.log(bullets);
    
    if(bullets != 0){
     // console.log(bullets);
      for (const bullet of bullets) {
        bullet.updatePosition(deltaTime,canvas,isShoot);
        bullet.draw(context);
      }
    }

    map.draw(context)
    
     
    predictBullet = nextBullet.getBullet();
    
    if (predictBullet instanceof Ball) {
      // console.log(123)
      predictBullet.draw(context);
      firstShoot = false;
    }
    collisionManager.checkCollisions();
    requestAnimationFrame(gameLoop);
  }
  gameLoop();
