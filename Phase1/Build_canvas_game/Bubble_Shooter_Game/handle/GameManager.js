import { gameState } from "../main/index.js";

export class GameManager {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.buttons = [
      {
        text: "Play Game",
        x: canvas.width / 2,
        y: canvas.height / 2 - 50,
        width: 200,
        height: 50,
        hovered: false,
        onClick: () => this.startGame(),
      },
      {
        text: "Settings",
        x: canvas.width / 2,
        y: canvas.height / 2 + 20,
        width: 200,
        height: 50,
        hovered: false,
        onClick: () => this.openSettings(),
      },
      {
        text: "Exit",
        x: canvas.width / 2,
        y: canvas.height / 2 + 90,
        width: 200,
        height: 50,
        hovered: false,
        onClick: () => this.showInstructions(),
      },
    ];

    this.isVisible = true;
    this.gameStarted = false;
    this.setupEventListeners();
    this.sShoot = false;
    this.isFall = false;
    this.timesShoot = 0;
    this.levelCompleted =  false;
  }
    
      setShoot(value) {
        this.isShoot = value;
      }
      getImg(){
        return imgBall1;
      }
      getShoot() {
        return this.isShoot;
      }
      updateTimes(){
        this.timesShoot += 1;
      }
      times(){
         return this.timesShoot;
      }
      timesReset(){
        this.timesShoot = 0;
      }
      nextLevel(value){
        this.levelCompleted = value;
      }
      getLevel(){
        return this.levelCompleted;
      }
  

  setupEventListeners() {
    this.canvas.addEventListener("mousemove", (e) => this.handleMouseMove(e));
    this.canvas.addEventListener("click", (e) => this.handleClick(e));
  }

  handleMouseMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    this.buttons.forEach((button) => {
      button.hovered = this.isPointInButton(mouseX, mouseY, button);
    });
  }

  handleClick(event) {
    if (!this.isVisible) return;

    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    this.buttons.forEach((button) => {
      if (this.isPointInButton(mouseX, mouseY, button)) {
        button.onClick();
      }
    });
  }

  isPointInButton(x, y, button) {
    return (
      x >= button.x - button.width / 2 &&
      x <= button.x + button.width / 2 &&
      y >= button.y - button.height / 2 &&
      y <= button.y + button.height / 2
    );
  }

  draw() {
    if (!this.isVisible) return;

    // Vẽ background mờ
    this.context.fillStyle = "rgba(0, 0, 0, 0.8)";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.fillStyle = "#fff";
    this.context.font = "bold 48px robo";
    this.context.textAlign = "center";
    this.context.fillText("PikaBall", this.canvas.width / 2, 100);

    // Vẽ các nút
    this.buttons.forEach((button) => {
      // Vẽ background nút
      this.context.fillStyle = button.hovered ? "#4CAF50" : "#2E7D32";
      this.context.beginPath();
      this.context.roundRect(
        button.x - button.width / 2,
        button.y - button.height / 2,
        button.width,
        button.height,
        20
      );
      this.context.fill();

      this.context.fillStyle = "#000";
      this.context.font = "24px robo";
      this.context.textAlign = "center";
      this.context.textBaseline = "middle";
      this.context.fillText(button.text, button.x, button.y);
    });
  }

  startGame() {
    this.isVisible = false;
    this.gameStarted = true;
    setTimeout(()=>{
      gameState.setShoot(true);
    },100);
  }

  openSettings() {
    console.log("Opening settings...");
  }

  showInstructions() {
    console.log("Showing instructions...");
  }

  show() {
    this.isVisible = true;
  }

  hide() {
    this.isVisible = false;
  }

  isGameStarted() {
    return this.gameStarted;
  }

  drawEndGame(score) {
    // Vẽ background mờ
    this.context.fillStyle = "rgba(0, 0, 0, 0.8)";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Vẽ tiêu đề "Game Over"
    this.context.fillStyle = "#fff";
    this.context.font = "bold 48px robo";
    this.context.textAlign = "center";
    this.context.fillText("END GAME", this.canvas.width / 2, 100);

    // Hiển thị điểm số
    // this.context.font = "32px robo";
    // this.context.fillText(`Score: ${score}`, this.canvas.width / 2, 180);

    // Tạo các nút cho màn hình end game
    const endGameButtons = [
      {
        text: "Play Again",
        x: this.canvas.width / 2,
        y: this.canvas.height / 2,
        width: 200,
        height: 50,
        hovered: false,
        onClick: () => this.restartGame(),
      },
      {
        text: "Main Menu",
        x: this.canvas.width / 2,
        y: this.canvas.height / 2 + 70,
        width: 200,
        height: 50,
        hovered: false,
        onClick: () => this.returnToMainMenu(),
      }
    ];

    // Vẽ các nút
    endGameButtons.forEach((button) => {
      // Vẽ background nút
      this.context.fillStyle = button.hovered ? "#4CAF50" : "#2E7D32";
      this.context.beginPath();
      this.context.roundRect(
        button.x - button.width / 2,
        button.y - button.height / 2,
        button.width,
        button.height,
        20
      );
      this.context.fill();

      // Vẽ text nút
      this.context.fillStyle = "#fff";
      this.context.font = "24px robo";
      this.context.textAlign = "center";
      this.context.textBaseline = "middle";
      this.context.fillText(button.text, button.x, button.y);
    });
  }

  restartGame() {
    this.gameStarted = true;
    this.isVisible = false;
    this.timesShoot = 0;
    setTimeout(() => {
      gameState.setShoot(true);
    }, 100);
  }

  returnToMainMenu() {
    this.gameStarted = false;
    this.isVisible = true;
    this.timesShoot = 0;
    this.draw();
  }
}
