import { gameState } from "../main/index.js";
import { PauseMenu } from "./PauseMenu.js";

export class GameMenu {
  constructor(canvas, context, imgMenuPath) {
    this.canvas = canvas;
    this.context = context;
    this.imgMenu = new Image();
    this.imgMenu.src = imgMenuPath;
    this.buttons = [
      {
        text: "Pause",
        x: 20,
        y: 20,
        width: 30,
        height: 30,
        hovered: false,
        scale: 1,
        onclick: () => this.pause(),
      },
    ];
    this.isVisible = true;
    this.gamePause = false;
    this.particles = [];
    this.setupEventListeners();
    // this.loadAssets();
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
      //console.log(button);

      if (this.isPointInButton(mouseX, mouseY, button)) {
        // this.clickSound.currentTime = 0;
        // this.clickSound.play().catch(() => {});
        button.onclick();
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

    // // Vẽ background mờ
    // this.context.fillStyle = "rgba(0, 0, 0, 0.8)";
    // this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // this.context.fillStyle = "#fff";
    // this.context.font = "bold 48px robo";
    // this.context.textAlign = "center";
    // this.context.fillText("Pika Shooter", this.canvas.width / 2, 100);

    // Vẽ các nút
    this.buttons.forEach((button) => {
      if (this.imgMenu.complete) {
        this.context.save();
        this.context.translate(button.x, button.y);
        const scale = button.hovered ? 1.1 : 1;
        this.context.scale(scale, scale);
        this.context.drawImage(
          this.imgMenu,
          -button.width / 2,
          -button.height / 2,
          button.width,
          button.height
        );
        this.context.restore();
      }
    });
  }
  pause() {
    gameState.setShoot(false);
    gameState.setPause(true);
   console.log("hi");
   console.log(gameState.getPause());
   
  }
}
