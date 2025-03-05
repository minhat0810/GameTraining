import { gameState } from "../main/index.js";

export class PauseMenu {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.isVisible = false; // Start with menu hidden
    this.buttons = [
      {
        text: "Resume",
        x: canvas.width / 2,
        y: canvas.height / 2 - 50,
        width: 200,
        height: 50,
        hovered: false,
        scale: 1,
        onclick: () => this.continueGame(),
      },
      {
        text: "Restart",
        x: canvas.width / 2,
        y: canvas.height / 2 + 20,
        width: 200,
        height: 50,
        hovered: false,
        scale: 1,
        onclick: () => this.restartGame(),
      },
      {
        text: "Exit",
        x: canvas.width / 2,
        y: canvas.height / 2 + 90,
        width: 200,
        height: 50,
        hovered: false,
        scale: 1,
      },
    ];
    this.setupEventListeners();
  }

  draw(context, canvas) {
    if (!gameState.getPause()) return; // Only draw when paused

    context.fillStyle = "rgba(0, 0, 0, 0.7)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = "bold 48px Arial";
    context.fillStyle = "#ffffff";
    context.textAlign = "center";
    context.fillText("PAUSED", canvas.width / 2, canvas.height / 3);

    this.buttons.forEach((button) => {
      context.fillStyle = button.hovered ? "#4CAF50" : "#2E7D32";
      context.beginPath();
      context.roundRect(
        button.x - button.width / 2,
        button.y - button.height / 2,
        button.width,
        button.height,
        10
      );
      context.fill();

      context.font = "24px Arial";
      context.fillStyle = "#ffffff";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(button.text, button.x, button.y);
    });
  }

  setupEventListeners() {
    this.canvas.addEventListener("mousemove", (e) => this.handleMouseMove(e));
    this.canvas.addEventListener("click", (e) => this.handleClick(e));
  }

  handleMouseMove(event) {
    if (!gameState.getPause()) return; 
    
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    this.buttons.forEach((button) => {
      button.hovered = this.isPointInButton(mouseX, mouseY, button);
    });
  }

  handleClick(event) {
    if (!gameState.getPause()) return; 
    
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    this.buttons.forEach((button) => {
      if (this.isPointInButton(mouseX, mouseY, button) && button.onclick) {
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

  continueGame() {
    gameState.setPause(false);
    setTimeout(()=>{
         gameState.setShoot(true);
    },100);
  }

  restartGame() {
    gameState.setPause(false);
    gameState.setShoot(false);
    gameState.timesReset();
    gameState.nextLevel(false);
    gameState.currentLevel = 1;
    window.location.reload();
  }
}
