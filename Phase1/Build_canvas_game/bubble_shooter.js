const canvas         = document.getElementById("gameCanvas");
const context        = canvas.getContext("2d");

let imgPlayerR       = null;
let mouseX           = canvas.width/2;
let mouseY           = canvas.height/2;
let circle;
let currentBallColor = "";
let isShoot          = true;
let bullet;
const rows           = 4; // Số hàng bóng
const cols           = 10; // Số cột bóng
const ballRadius     = 20; 
const grid           = [];
let currentBall      = null;
let nextBall         = null;
const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
let bulletFist = true;
let shooting;
let check;
let poisition;
let a = 1;
let b = 0;

/// LEVEL/MAP ////
let level1 = './map/level1.txt';



///

///////////////////////////////////// GAME MANAGER ////////////////////////////////////
class GameManager {
    constructor() {
        this.score = 0;
        this.health = 3;  // Mạng ban đầu
        this.state = 'playing'; // Possible states: 'playing', 'paused', 'gameOver'
    }

    setState(newState) {
        this.state = newState;
    }

    updateScore(points) {
        this.score += points;
        if (this.score % 100 === 0) { // Mỗi khi điểm số chia hết cho 100
            this.increaseSpeed();
        }
    }

    resetGame() {
        this.score = 0;
        this.health = 3;
        this.state = 'playing';
    }
}

const gameManager = new GameManager();

gameManager.setState('paused'); // Changes the game state

///////////////////////////////////// GAME MANAGER ////////////////////////////////////

///////////////////////////////////// INPUT ////////////////////////////////////
class InputController {
    constructor() {
        this.keys = {};
        window.addEventListener('keydown', (e) => this.keys[e.key] = true);
        window.addEventListener('keyup', (e) => this.keys[e.key] = false);
        window.addEventListener("mousemove",(e)=>{
            updateRotationToMouse(e);
        })
        
        window.addEventListener("click",(e)=>{
           
           if(isShoot){
            shooting = queue.dequeue(); // Lấy và xóa quả bóng đầu tiên      
           // console.log(a);
            const nextBall = getRandomColor();
            queue.enqueue(nextBall);
           // console.log(shooting);
            
            predictBullet = new Bullet(280,610,10,0,queue.front(),0);
          //  queue.print();
            //console.log(queue.front());
            shootBullet(shooting);
            isShoot = false;
            //shooting = null;
           }
         
        })
    }
    
    isKeyPressed(key) {
        return this.keys[key] || false;
    }
}



const inputController = new InputController();


///////////////////////////////////// INPUT ////////////////////////////////////

///////////////////////////////////// CHECK COLLISION ////////////////////////////////////
class CollisionManager {
    constructor() {
        this.colliders = [];
    }

    addCollider(collider) {
        this.colliders.push(collider);
    }

    removeCollider(collider) {
        const index = this.colliders.indexOf(collider);
        if (index > -1) this.colliders.splice(index, 1);
    }

    checkCollisions() {
        for (let i = 0; i < this.colliders.length; i++) {
            for (let j = i + 1; j < this.colliders.length; j++) {
                const colliderA = this.colliders[i];
                const colliderB = this.colliders[j];

                if (colliderA.checkCollision(colliderB)) {
                    colliderA.onCollision(colliderB);
                    colliderB.onCollision(colliderA);
                }
            }
        }
    }
}

const collisionManager = new CollisionManager();

class Collider {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isColliding = false; // Trạng thái va chạm
    }

    checkCollision(other) {
        throw new Error("checkCollision() must be implemented in a subclass");
    }

    onCollision(other) {
      //  this.isColliding = true;
        bullet.speed = 0;
        bullet.y = bullet.y+1;
      //  this.isColliding = false;
        const row = Math.floor((bullet.y - ballRadius) / (ballRadius * 2));
        const col = Math.floor((bullet.x - ballRadius) / (ballRadius * 2));

        // console.log(row);
        // console.log(col);
       // console.log(bullet.color);
        console.log(circle.color);
        
        
        
        isShoot = true;
    }
}
///////////////////////////////////// CHECK COLLISION ////////////////////////////////////

///////////////////////////////////// BUBBLES ////////////////////////////////////

class CircleCollider extends Collider {
    constructor(x, y, radius, imageSrc = null, color = 'red',speed,angle) {
        super(x, y);
        this.radius = radius;
        this.speed = speed;
        this.isColliding = false; // Trạng thái va chạm
        this.image = null;
        this.color = color;
        this.angle = angle;

        if (imageSrc) {
            this.image = new Image();
            this.image.src = imageSrc;
        }
    }

    checkCollision(other) {
        if (other instanceof CircleCollider) {
            const dx = this.x - other.x;
            const dy = this.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < this.radius + other.radius;
        } else if (other instanceof RectCollider) {
            return other.checkCollision(this); // Delegate to RectCollider for circle-rect collision
        }
        return false;
    }

    draw() {
        if (this.image) {
            context.drawImage(
                this.image,
                this.x - this.radius,
                this.y - this.radius,
                this.radius * 2,
                this.radius * 2
            );
        } else {
            context.beginPath();
            context.arc(this.x, this.y+this.radius, this.radius, 0, 2 * Math.PI);
            context.fillStyle = this.color; // Dùng màu sắc được truyền vào
            context.fill();
            context.lineWidth = 2;        // Độ dày của viền
            context.strokeStyle = 'black'; // Màu viền
            context.stroke(); 
        }
    }

    updatePosition(deltaTime) {
        this.x += Math.cos(this.angle) * this.speed * deltaTime ;
        this.y += Math.sin(this.angle) * this.speed * deltaTime ; // Di chuyển theo hướng chuột
        if(this.x + this.radius >canvas.width || this.x - this.radius <0){
             this.angle = Math.PI - this.angle;
        }
        if(this.y < 0){
            this.speed = 0;
            this.y = this.y+2;
            isShoot = true;
        }
        
        // if(this.y + this.radius >canvas.height || this.y - this.radius <0){
        //      //this.angle = Math.PI - this.angle;
        // }
        return { y: this.y }
    }
}
///////////////////////////////////// BUBBLES ////////////////////////////////////

///////////////////////////////////// SHOOTER ////////////////////////////////////
class Shooter {
    constructor(x, y, width, height, speed, imageSrc = null) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.imgPlayerR = null;

        if (imageSrc) {
            this.imgPlayerR = new Image();
            this.imgPlayerR.src = imageSrc;
        }
    }

    draw() {
        if (this.imgPlayerR && this.imgPlayerR.complete) {
            context.drawImage(this.imgPlayerR, this.x, this.y, this.width, this.height);
        } else {
            context.fillStyle = 'blue'; 
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    updatePosition() {
        if (inputController.isKeyPressed('ArrowLeft')) {
            this.x -= this.speed;
        }
        if (inputController.isKeyPressed('ArrowRight')) {
            this.x += this.speed; 
        }
        
 
        this.x = Math.max(0, Math.min(canvas.width - this.width, this.x));
    }
    calculatePrediction() {
        const maxDistance = 500; // Tổng khoảng cách đường bắn dự đoán
        const points = []; // Danh sách các điểm của đường đi

        let currentX = this.x + this.width / 2; // Điểm hiện tại (Shooter)
        let currentY = this.y;
        
        let dx = mouseX - currentX; // Hướng di chuyển ban đầu
        let dy = mouseY - currentY;

        const angle = Math.atan2(dy, dx);

        dx = Math.cos(angle);
        dy = Math.sin(angle);
       
        
        let distanceTraveled = 0;

        // Tính toán điểm va chạm và phản xạ
        while (distanceTraveled < maxDistance && currentY < canvas.height) {
            if (currentX + dx  < ballRadius || currentX + dx > canvas.width - ballRadius ) {
                dx = -dx; // Đảo ngược hướng x
            }

            currentX += dx; // Cập nhật vị trí x
            currentY += dy; // Cập nhật vị trí y
            distanceTraveled += Math.sqrt(dx * dx + dy * dy);
          //  console.log(distanceTraveled);
            
            points.push({ x: currentX, y: currentY }); // Thêm điểm vào danh sách
        }

    return points;
    }

    drawPrediction(mouseX, mouseY) {
        const points = this.calculatePrediction();
        context.save();
        context.beginPath();
        context.moveTo(this.x + this.width / 2, this.y); // Bắt đầu từ vị trí Shooter
        
        for (const point of points) {
            context.lineTo(point.x, point.y); 
        }
        
        context.lineWidth = 2;
        context.setLineDash([5, 5]); // Đường nét đứt
        context.stroke();
        context.restore();
    }

    calculateAngleToMouse() {
        const dx = mouseX - this.x - this.width/2;
        const dy = mouseY - this.y ;
        
        return Math.atan2(dy, dx); // Trả về góc giữa Shooter và chuột
    }
    
}

///////////////////////////////////// SHOOTER ////////////////////////////////////

///////////////////////////////////// BULLET ////////////////////////////////////

class Bullet extends CircleCollider {
    constructor(x, y, radius, speed, color,angle) {
        const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        super(x, y, radius, null, color, speed); 
        this.angle = angle;
    }

    // Cập nhật vị trí của viên đạn
    updatePosition(deltaTime) {
        this.x += Math.cos(this.angle) * this.speed * deltaTime ;
        this.y += Math.sin(this.angle) * this.speed * deltaTime ; // Di chuyển theo hướng chuột
        if(this.x>canvas.width || this.x<0){
             this.angle = Math.PI - this.angle;
        }
        console.log(this.y);
        
        return { y: this.y }
        
    }
///////////////////////////////////// BULLET ////////////////////////////////////

    draw() {
        context.beginPath();
        context.arc(this.x, this.y+this.radius, this.radius, 0, 2 * Math.PI);   
        context.fillStyle = this.color;
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = 'black';
        context.stroke();
    }
    
}


const bullets = [];

///////////////////////////////////// QUEUE  /////////////////////////////////////
class BallPrediction {
    constructor() {
        this.items = []; // Khởi tạo mảng
    }

    enqueue(element) {
        this.items.push(element); // Thêm phần tử vào cuối hàng đợi
    }

    dequeue() {
        if (this.isEmpty()) {
            return "Queue is empty";
        }
        return this.items.shift(); // Lấy phần tử đầu tiên và xóa nó khỏi mảng
    }

    isEmpty() {
        return this.items.length === 0; // Kiểm tra hàng đợi có rỗng không
    }

    front() {
        if (this.isEmpty()) {
            return "Queue is empty";
        }
        return this.items[0]; // Lấy phần tử đầu mà không xóa
    }

    size() {
        return this.items.length; // Trả về kích thước hàng đợi
    }

    clear() {
        this.items = []; // Xóa tất cả phần tử
    }

    print() {
        console.log(this.items.toString()); // In ra hàng đợi
    }
}

///////////////////////////////////// QUEUE  /////////////////////////////////////
///////////////////////////////////// BULLET ////////////////////////////////////

///////////////////////////////////// GAME WORLD ////////////////////////////////////


for (let i = 0; i < rows; i++) {
  grid[i] = [];
  for (let j = 0; j < cols; j++) {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    grid[i][j] = randomColor;
  }
}
const circles = [];

// //Hàm vẽ lưới bóng


    let imgPlayer = "./img/Player/pika_lazy.png";
    const shoot = new Shooter(canvas.width / 2 - 50, canvas.height - 60, 100, 80, 350, imgPlayer); 
    let dream = "./img/Player/dream.png";
    const lazy = new Shooter(230, canvas.height - 110, 100, 80, 350, dream); 

    function updateRotationToMouse(event) {
             mouseX = event.clientX - canvas.offsetLeft; // Tọa độ x của chuột trên canvas
             mouseY = event.clientY - canvas.offsetTop; // Tọa độ y của chuột trên canvas
           
    }
    
    function shootBullet(color) {
        const angle = shoot.calculateAngleToMouse(); // Tính toán góc bắn
        bullet  =  new CircleCollider(canvas.width/2, canvas.height-100,ballRadius,null,color,1000,angle);
        collisionManager.addCollider(bullet);
        bullets.push(bullet);
        // console.log(color);
        
        
    }
    
    function getRandomColor() {
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    }

    const queue = new BallPrediction();
    
    let firstBall = getRandomColor();
    // let secondBall = getRandomColor();
    // let lastBall   = getRandomColor();

    
    queue.enqueue(firstBall);
    // queue.enqueue(secondBall);
    // queue.enqueue(lastBall);
    
    //queue.print();
    
    predictBullet = new Bullet(280,610,10,0,firstBall,0);

                    /////////// LOAD MAP //////////////
    async function loadMap(filePath) {
        try {
            const response = await fetch(filePath);
            const text = await response.text();

            // Chuyển đổi nội dung file thành mảng 2D
            const rows = text.trim().split('\n');
             const map = rows.map(row => row.split(' ').map(Number));
             //console.log(map);
             
            return map;
        } catch (error) {
            console.error('Lỗi khi tải map:', error);
        }
    }
    
    

    function drawMap(grid) {
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                poisition = grid[i][j]; 
                const offsetX = (i % 2 === 0) ? 0 : ballRadius; // Dịch ngang cho hàng lẻ
                const x = j * ballRadius * 2 + ballRadius + offsetX;
                const y = i * ballRadius * 2 + ballRadius-20; 
                circle = new CircleCollider(x, y, ballRadius, null, getColor(poisition),0);
                //console.log(`Poisition (${x}, ${y}): ${poisition}`);
                //console.log(circle.color);
                
                circles.push(circle); 
                
                collisionManager.addCollider(circle); 
            }
        }
    }

    function getColor(group) {
        if (group >= 1 && group <= colors.length) {
            return colors[group - 1]; 
        }
        return 'gray'; 
    }
    function drawCircles() {
        for (const circle of circles) {
            circle.draw();
        }
    }
    
    window.onload = () => {
        loadMap(level1).then(map => {
            drawMap(map);  // Gọi hàm vẽ sau khi tải xong
        });
    };
    
    

 ///////////////////////////////////// GAME WORLD ////////////////////////////////////

  ///////////////////////////////////// HELPER ////////////////////////////////////

// Cập nhật lại drawHUD để hiển thị số mạng
function drawHUD(context, score, health) {
    context.fillStyle = 'red';
    context.font = '20px Arial';
    context.fillText(`Score: ${score}`, 10, 20);
    context.fillText(`Health: ${health}`, 10, 40);
}

let lastTime = 0;
function gameLoop(timeStamp) {
    const deltaTime = (timeStamp - lastTime) / 1000;
    lastTime = timeStamp;

    if (gameManager.state === 'gameOver') {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'red';
        context.font = '30px Arial';
        context.fillText('Game Over!', canvas.width / 2 - 80, canvas.height / 2); // Hiển thị thông báo "Game Over"
        return; // Dừng di chuyển
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    drawCircles();
    //drawMap(loadMap(level1));
   
    shoot.drawPrediction(mouseX,mouseY);
    for (const bullet of bullets) {
        bullet.updatePosition(deltaTime); // Cập nhật vị trí viên đạn
        bullet.draw(); 
        if (bullet.y < -bullet.radius) {
            bullets.splice(bullet, 1);
            collisionManager.addCollider(bullet);
            collisionManager.removeCollider(bullet);
        }
    }
    lazy.draw();
    predictBullet.draw();
    shoot.draw();
    collisionManager.checkCollisions();
    requestAnimationFrame(gameLoop);
}
gameLoop();

class AudioManager {
    constructor() {
        this.sounds = {};
    }

    loadSound(name, src) {
        const audio = new Audio(src);
        this.sounds[name] = audio;
    }

    playSound(name) {
        if (this.sounds[name]) this.sounds[name].play();
    }
}

const audioManager = new AudioManager();
audioManager.loadSound('collisionFruit', './res/coin.wav');
audioManager.loadSound('collisionHealth', './res/powerup.wav');
