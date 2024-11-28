const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
let imgPlayerR = null;

class GameManager {
    // constructor() {
    //     this.score = 0;
    //     this.state = 'playing'; // Possible states: 'playing', 'paused', 'gameOver'
    // }

    // setState(newState) {
    //     this.state = newState;
    // }

    // updateScore(points) {
    //     this.score += points;
    // }

    // resetGame() {
    //     this.score = 0;
    //     this.state = 'playing';
    // }
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

    decreaseHealth() {
        this.health -= 1;
        if (this.health <= 0) {
            this.setState('gameOver');
            console.log("Game Over");
        }
    }

    increaseSpeed() {
        // Tăng tốc độ rơi của trái cây khi điểm số tăng
        randomCircles.forEach(circle => {
            circle.speed += 0.5; // Tăng tốc độ rơi thêm 0.5 mỗi khi đạt 100 điểm
        });
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
            console.log("Collision detected with:", other);
            gameManager.updateScore(10); // Cộng điểm
            this.isColliding = true; // Đánh dấu đã xử lý

        const index = randomCircles.indexOf(this);
            if (index > -1) {
                randomCircles.splice(index, 1);
                collisionManager.removeCollider(this);
            }
        }
    }
    
}

class CircleCollider extends Collider {
    constructor(x, y, radius,speed,imageSrc = null) {
        super(x, y);
        this.radius = radius;
        this.speed = speed;
        this.isColliding = false; // Trạng thái va chạm
        this.image = null;

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
            context.fillStyle = 'black';
            context.fill();
        }
    }
    updatePosition(deltaTime){
        this.y += this.speed ;
        //console.log(deltaTime);
        
    }
}

class RectCollider extends Collider {
    constructor(x, y, width, height,speed,imageSrc = null) {
        super(x, y);
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.imgPlayerR = null;

         if (imageSrc) {
            this.imgPlayerR = new Image();
            this.imgPlayerR.src = imageSrc;
        }
        this.animationFramesLeft = [
            "./img/Player/pika_left1.png",
            "./img/Player/pika_left2.png",
            "./img/Player/pika_left3.png",
            "./img/Player/pika_left4.png"
        ];
         this.animationFramesRight = [
            "./img/Player/pika_move1_1.png",
            "./img/Player/pika_move2_1.png",
            "./img/Player/pika_move3_1.png",
            "./img/Player/pika_move4.png"
        ];
        this.currentFrame = 0;
        this.frameDuration = 200; // Duration for each frame
        this.lastFrameTime = 0;
    }

    draw(){
         if (this.imgPlayerR) {
             context.drawImage(this.imgPlayerR, this.x, this.y, this.width, this.height);
        }else{
        context.fillStyle = 'blue'; 
        context.fillRect(this.x,this.y,this.width,this.height);
        }
                // Vẽ đường viền xung quanh
        // context.strokeStyle = 'red'; // Màu đường viền
        // context.lineWidth = 3;       // Độ dày đường viền
        // context.strokeRect(this.x, this.y, this.width, this.height);
    }
    updatePosition(deltaTime){
           const directions = ["ArrowLeft", "ArrowRight"];

            directions.forEach((key) => {
                switch (key) {
                     case "ArrowLeft":
                    if (inputController.isKeyPressed(key)) {
                        this.x -= this.speed * deltaTime;
                        this.isMovingLeft = true;
                        this.isMovingRight = false; // Stop right animation
                        this.updateAnimation(deltaTime);
                    } else {
                        this.isMovingLeft = false;
                    }
                    break;
                case "ArrowRight":
                    if (inputController.isKeyPressed(key)) {
                        this.x += this.speed * deltaTime;
                        this.isMovingRight = true;
                        this.isMovingLeft = false; // Stop left animation
                        this.updateAnimation(deltaTime);
                    } else {
                        this.isMovingRight = false;
                    }
                    break;
                }
            });

            // Giới hạn nhân vật trong canvas
            this.x = Math.max(0, Math.min(this.x, canvas.width - this.width));
            this.y = Math.max(0, Math.min(this.y, canvas.height - this.height));

    }
    updateAnimation(deltaTime) {
        // Choose the animation frames based on the direction
        const frames = this.isMovingLeft ? this.animationFramesLeft : this.animationFramesRight;

        // Switch animation frame based on time passed
        if (performance.now() - this.lastFrameTime >= this.frameDuration) {
            this.lastFrameTime = performance.now();
            this.currentFrame = (this.currentFrame + 1) % frames.length;
            this.imgPlayerR.src = frames[this.currentFrame];
        }
    }
    checkCollision(other) {
        if (other instanceof RectCollider) {
            return (
                this.x < other.x + other.width &&
                this.x + this.width > other.x &&
                this.y < other.y + other.height &&
                this.y + this.height > other.y
            );
        } else if (other instanceof CircleCollider) {
            const closestX = Math.max(this.x, Math.min(other.x, this.x + this.width));
            const closestY = Math.max(this.y, Math.min(other.y, this.y + this.height));
            const dx = other.x - closestX;
            const dy = other.y - closestY;
            return dx * dx + dy * dy < other.radius * other.radius;
        }
        return false;
        
    }
    
}
let imgPlayer = "./img/Player/pika_start2.png"
const player = new RectCollider(canvas.width/2-50, canvas.height-20, 100, 80,350,imgPlayer);
//const enemy = new CircleCollider(200, 100, 15,2);
const inputController = new InputController();

collisionManager.addCollider(player);
//collisionManager.addCollider(enemy);

// const star = new CircleCollider(canvas.width / 2 - 25, canvas.height - 50, 50, 20, 300);
// const player = new RectCollider(canvas.width/2, canvas.height,50,20,300);

const randomCircles = []; // Mảng quản lý các hình tròn ngẫu nhiên

function spawnRandomCircle() {
    const x = Math.random() * canvas.width; 
    const radius = 20; 
    const speed = 1 + Math.floor(gameManager.score / 100) * 0.5; // Tăng tốc độ rơi mỗi khi điểm số đạt mốc 100
    const y = -radius; // Bắt đầu từ phía trên canvas

    // Sử dụng hình ảnh cho ngôi sao (hình tròn)
    const imageSrc = "./img/fruit-hp.png";
    const circle = new CircleCollider(x, y, radius, speed, imageSrc);
    randomCircles.push(circle);
    collisionManager.addCollider(circle);
}
setInterval(spawnRandomCircle, 1000); 

// Game loop (simplified)
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

    randomCircles.forEach((circle, index) => {
        circle.updatePosition(deltaTime);
        circle.draw();

        // Xóa hình tròn nếu nó rơi ra khỏi canvas
        if (circle.y - circle.radius > canvas.height) {
            collisionManager.removeCollider(circle);
            randomCircles.splice(index, 1);
            gameManager.decreaseHealth();  // Trừ mạng khi trái cây chạm đáy
        }
    });

    player.updatePosition(deltaTime);
    player.draw();

    drawHUD(context, gameManager.score, gameManager.health); // Hiển thị điểm và mạng

    collisionManager.checkCollisions();
    requestAnimationFrame(gameLoop);
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

// const audioManager = new AudioManager();
// audioManager.loadSound('jump', 'jump.wav');
// audioManager.playSound('jump');  // Plays the "jump" sound

// function drawHUD(context, score, health) {
//     context.fillStyle = 'red';
//     context.font = '20px Arial';
//     context.fillText(`Score: ${score}`, 10, 20);
//     context.fillText(`Health: ${health}`, 10, 40);
// }




