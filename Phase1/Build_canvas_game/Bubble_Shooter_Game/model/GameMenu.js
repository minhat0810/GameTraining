export class GameMenu {
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
                onClick: () => this.startGame()
            },
            {
                text: "Settings",
                x: canvas.width / 2,
                y: canvas.height / 2 + 20,
                width: 200,
                height: 50,
                hovered: false,
                onClick: () => this.openSettings()
            },
            {
                text: "How to Play",
                x: canvas.width / 2,
                y: canvas.height / 2 + 90,
                width: 200,
                height: 50,
                hovered: false,
                onClick: () => this.showInstructions()
            }
        ];
        
        this.isVisible = true;
        this.gameStarted = false;
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
    }

    handleMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        this.buttons.forEach(button => {
            button.hovered = this.isPointInButton(mouseX, mouseY, button);
        });
    }

    handleClick(event) {
        if (!this.isVisible) return;

        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        this.buttons.forEach(button => {
            if (this.isPointInButton(mouseX, mouseY, button)) {
                button.onClick();
            }
        });
    }

    isPointInButton(x, y, button) {
        return x >= button.x - button.width/2 &&
               x <= button.x + button.width/2 &&
               y >= button.y - button.height/2 &&
               y <= button.y + button.height/2;
    }

    draw() {
        if (!this.isVisible) return;

        // Vẽ background mờ
        this.context.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Vẽ tiêu đề game
        this.context.fillStyle = '#fff';
        this.context.font = 'bold 48px Arial';
        this.context.textAlign = 'center';
        this.context.fillText('Bubble Shooter', this.canvas.width/2, 100);

        // Vẽ các nút
        this.buttons.forEach(button => {
            // Vẽ background nút
            this.context.fillStyle = button.hovered ? '#4CAF50' : '#2E7D32';
            this.context.beginPath();
            this.context.roundRect(
                button.x - button.width/2,
                button.y - button.height/2,
                button.width,
                button.height,
                10
            );
            this.context.fill();

            // Vẽ text nút
            this.context.fillStyle = '#fff';
            this.context.font = '24px Arial';
            this.context.textAlign = 'center';
            this.context.textBaseline = 'middle';
            this.context.fillText(button.text, button.x, button.y);
        });
    }

    startGame() {
        this.isVisible = false;
        this.gameStarted = true;
       
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
}
