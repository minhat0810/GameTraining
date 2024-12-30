  import { Shooter } from "../model/Shooter.js";
  import { Draw } from "../model/Draw.js";
  import { InputController } from "../handle/InputController.js";
  import { BallPrediction } from "../model/BallPrediction.js";
  import { CircleCollider } from "../model/CircleCollider.js";
  import { CollisionManager } from "../handle/CollisionManager.js"

  const canvas = document.getElementById("gameCanvas");
  const context = canvas.getContext("2d");

  const circles = [];
  let mouseX = 0;
  let mouseY = 0;
  let level1 = "../assets/levels/level1.txt";
  let imgPlayer = "../assets/img/Player/pika_lazy.png";
  const ballRadius = 20;
  let isShoot = true;
  const colors = ["red", "blue", "green", "yellow", "purple"];
  let shooting;
  let predictBullet;
  let bullet;
  let bullets = [];

  const queue = new BallPrediction();
  const inputController = new InputController(canvas, updateRotationToMouse,isShoot,queue,shooting,getRandomColor,predictBullet,shootBullet);
  const shoot = new Shooter(canvas.width / 2 - 50,canvas.height - 60,100,80,350,imgPlayer);
  const drawShoot = new Draw(context,shoot);
  const collisionManager = new CollisionManager();
 

  let firstBall = getRandomColor();
  queue.enqueue(firstBall);
  


  function updateRotationToMouse(event) {
    mouseX = event.clientX - canvas.offsetLeft;
    mouseY = event.clientY - canvas.offsetTop;
  }

  const getBullets = () => bullets;

  function shootBullet(color) {
    const angle = shoot.calculateAngleToMouse(mouseX,mouseY); // Tính toán góc bắn
   // console.log(angle);
    
    bullet = new CircleCollider(canvas.width / 2,canvas.height - 80,ballRadius,null,color,800,angle,isShoot);
    collisionManager.addCollider(bullet);
    bullets.push(bullet);
       
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

  //   if (gameManager.state === "gameOver") {
  //     context.clearRect(0, 0, canvas.width, canvas.height);
  //     context.fillStyle = "red";
  //     context.font = "30px Arial";
  //     context.fillText("Game Over!", canvas.width / 2 - 80, canvas.height / 2); // Hiển thị thông báo "Game Over"
  //     return; // Dừng di chuyển
  //   }

    context.clearRect(0, 0, canvas.width, canvas.height);
    

    drawShoot.drawShooter(shoot);
    drawShoot.drawPrediction(shoot,mouseX,mouseY,canvas,ballRadius);
    
    for (const bullet of bullets) {
     // console.log(bullet);
      
      bullet.updatePosition(deltaTime,canvas,isShoot); // Cập nhật vị trí viên đạn
      bullet.draw(context);
      if (bullet.y < -bullet.radius) {
        bullets.splice(bullet, 1);
        collisionManager.addCollider(bullet);
        collisionManager.removeCollider(bullet);
      }
    }
    collisionManager.checkCollisions();
    requestAnimationFrame(gameLoop);
  }
  gameLoop();
