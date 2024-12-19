const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

let imgPlayerR = null;
let mouseX = canvas.width/2;
let mouseY = canvas.height/2;

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

class InputController {
    constructor() {
        this.keys = {};
        window.addEventListener('keydown', (e) => this.keys[e.key] = true);
        window.addEventListener('keyup', (e) => this.keys[e.key] = false);
        window.addEventListener("mousemove",(e)=>{
            updateRotationToMouse(e);
        })
        window.addEventListener("click",(e)=>{
           shootBullet();
        })
    }

    isKeyPressed(key) {
        return this.keys[key] || false;
    }
}

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
        if (!this.isColliding) { // Chỉ xử lý nếu chưa va chạm
            // Cộng điểm và xử lý va chạm
            if (other.type === 'fruit') {
                gameManager.updateScore(10); // Cộng điểm khi nhặt fruit
                audioManager.playSound('collisionFruit');
            } else if (other.type === 'stone') {
                gameManager.health = Math.min(gameManager.health + 1, 3); // Hồi mạng khi nhặt stone, tối đa 3 mạng
                audioManager.playSound('collisionHealth');
            }

            const index = randomCircles.indexOf(this);
            if (index > -1) {
                randomCircles.splice(index, 1);
                collisionManager.removeCollider(this);
            }
        }
    }
}

class CircleCollider extends Collider {
    constructor(x, y, radius, imageSrc = null, color = 'red',speed) {
        super(x, y);
        this.radius = radius;
        this.speed = speed;
        this.isColliding = false; // Trạng thái va chạm
        this.image = null;
        this.color = color;

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
            // Dự phòng nếu không có hình ảnh
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            context.fillStyle = this.color; // Dùng màu sắc được truyền vào
            context.fill();

            context.lineWidth = 2;        // Độ dày của viền
            context.strokeStyle = 'black'; // Màu viền
            context.stroke(); 
        }
    }

    updatePosition() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Nếu chạm cạnh trái hoặc phải canvas
        if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
            this.speedX = -this.speedX;
        }
        // Nếu chạm cạnh trên hoặc dưới canvas
        if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
            this.speedY = -this.speedY;
        }
    }
}
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
        const maxDistance = 2000; // Tổng khoảng cách đường bắn dự đoán
        const points = []; // Danh sách các điểm của đường đi

        let currentX = this.x + this.width / 2; // Điểm hiện tại (Shooter)
        let currentY = this.y;
        let dx = mouseX - currentX; // Hướng di chuyển ban đầu
        let dy = mouseY - currentY;
        console.log(dx);
        const angle = Math.atan2(dy, dx);
        const speed = 20; // Tăng dần khoảng cách cho mỗi bước

        dx = Math.cos(angle) * 1;
        dy = Math.sin(angle) * 1;
       
        
        let distanceTraveled = 0;

        // Tính toán điểm va chạm và phản xạ
        while (distanceTraveled < maxDistance && currentY < canvas.height) {
            if (currentX + dx < 0 || currentX + dx > canvas.width) {
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
        const dx = mouseX - this.x - this.width/2 ;
        const dy = mouseY - this.y ;
        console.log(dx);
        
        return Math.atan2(dy, dx); // Trả về góc giữa Shooter và chuột
    }
}
class Bullet extends CircleCollider {
    constructor(x, y, radius, speed, color,angle) {
        super(x, y, radius, null, color, speed); 
        this.angle = angle;
    }

    // Cập nhật vị trí của viên đạn
    updatePosition(deltaTime) {
        this.x += Math.cos(this.angle) * this.speed * deltaTime ;
        this.y += Math.sin(this.angle) * this.speed * deltaTime ; // Di chuyển theo hướng chuột
        if(this.x+this.radius>canvas.width || this.x-this.radius<0){
             this.angle = Math.PI - this.angle;
        }
    }


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

const inputController = new InputController();

const rows = 4; // Số hàng bóng
const cols = 10; // Số cột bóng
const ballRadius = 20; 
const grid = []; // Mảng lưu màu sắc các bóng

// Các màu sắc có thể dùng
const colors = ['red', 'blue', 'green', 'yellow', 'purple'];

for (let i = 0; i < rows; i++) {
  grid[i] = [];
  for (let j = 0; j < cols; j++) {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    grid[i][j] = randomColor;
  }
}
const circles = [];

// Hàm vẽ lưới bóng
function drawGrid(grid) {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            const color = grid[i][j];
            const x = j * ballRadius * 2 + ballRadius; 
            const y = i * ballRadius * 2 + ballRadius; 
            const circle = new CircleCollider(x, y, ballRadius, null, color,0); 
            circles.push(circle); 
            collisionManager.addCollider(circle); 
        }
    }
}

// Vẽ toàn bộ bóng từ mảng `circles`
function drawCircles() {
    for (const circle of circles) {
        circle.draw();
    }
}
let imgPlayer = "./img/Player/pikachu_tacke.jpg";
const shoot = new Shooter(canvas.width / 2 - 50, canvas.height - 80, 100, 80, 350, imgPlayer); 
drawGrid(grid);


 function updateRotationToMouse(event) {
             mouseX = event.clientX - canvas.offsetLeft; // Tọa độ x của chuột trên canvas
             mouseY = event.clientY - canvas.offsetTop; // Tọa độ y của chuột trên canvas
           
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
    shoot.drawPrediction(mouseX,mouseY);
    for (const bullet of bullets) {
        bullet.updatePosition(deltaTime); // Cập nhật vị trí viên đạn
        bullet.draw(); // Vẽ viên đạn
    }
    shoot.draw();
    collisionManager.checkCollisions();
    requestAnimationFrame(gameLoop);
}
function shootBullet() {
    const angle = shoot.calculateAngleToMouse(); // Tính toán góc bắn
    const bullet = new Bullet(canvas.width / 2, canvas.height - 100, 20, 500, 'black', angle);
    bullets.push(bullet);
}

// Cập nhật lại drawHUD để hiển thị số mạng
function drawHUD(context, score, health) {
    context.fillStyle = 'red';
    context.font = '20px Arial';
    context.fillText(`Score: ${score}`, 10, 20);
    context.fillText(`Health: ${health}`, 10, 40);
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
