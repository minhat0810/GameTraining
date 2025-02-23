// export class GameMenu {
//     constructor(canvas, context) {
//         this.canvas = canvas;
//         this.context = context;
//         this.buttons = [
//             {
//                 text: "Play Game",
//                 x: canvas.width / 2,
//                 y: canvas.height / 2 - 50,
//                 width: 200,
//                 height: 50,
//                 hovered: false,
//                 scale: 1,
//                 onClick: () => this.startGame()
//             },
//             {
//                 text: "Settings",
//                 x: canvas.width / 2,
//                 y: canvas.height / 2 + 20,
//                 width: 200,
//                 height: 50,
//                 hovered: false,
//                 scale: 1,
//                 onClick: () => this.openSettings()
//             },
//             {
//                 text: "How to Play",
//                 x: canvas.width / 2,
//                 y: canvas.height / 2 + 90,
//                 width: 200,
//                 height: 50,
//                 hovered: false,
//                 scale: 1,
//                 onClick: () => this.showInstructions()
//             },
//             {
//                 text: "High Scores",
//                 x: canvas.width / 2,
//                 y: canvas.height / 2 + 160,
//                 width: 200,
//                 height: 50,
//                 hovered: false,
//                 scale: 1,
//                 onClick: () => this.showHighScores()
//             }
//         ];
        
//         this.isVisible = true;
//         this.gameStarted = false;
//         this.particles = [];
//         this.setupEventListeners();
//         this.loadAssets();
        
//         // Animation properties
//         this.titleY = -50;
//         this.targetTitleY = 100;
//         this.buttonsOpacity = 0;
//     }

//     loadAssets() {
//         // Load sound effects
//         // this.hoverSound = new Audio('assets/sounds/hover.mp3');
//         // this.clickSound = new Audio('assets/sounds/click.mp3');
        
//         // // Load background image
//         // this.backgroundImage = new Image();
//         // this.backgroundImage.src = 'assets/images/menu-bg.jpg';
//     }

//     setupEventListeners() {
//         this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
//         this.canvas.addEventListener('click', (e) => this.handleClick(e));
//     }

//     handleMouseMove(event) {
//         const rect = this.canvas.getBoundingClientRect();
//         const mouseX = event.clientX - rect.left;
//         const mouseY = event.clientY - rect.top;

//         this.buttons.forEach(button => {
//             const wasHovered = button.hovered;
//             button.hovered = this.isPointInButton(mouseX, mouseY, button);
            
//             // Play hover sound when button is first hovered
//             if (!wasHovered && button.hovered) {
//                 this.hoverSound.currentTime = 0;
//                 this.hoverSound.play().catch(() => {});
//             }
//         });
//     }

//     handleClick(event) {
//         if (!this.isVisible) return;

//         const rect = this.canvas.getBoundingClientRect();
//         const mouseX = event.clientX - rect.left;
//         const mouseY = event.clientY - rect.top;

//         this.buttons.forEach(button => {
//             if (this.isPointInButton(mouseX, mouseY, button)) {
//                 this.clickSound.currentTime = 0;
//                 this.clickSound.play().catch(() => {});
//                 button.onClick();
//             }
//         });
//     }

//     isPointInButton(x, y, button) {
//         return x >= button.x - button.width/2 &&
//                x <= button.x + button.width/2 &&
//                y >= button.y - button.height/2 &&
//                y <= button.y + button.height/2;
//     }

//     draw() {
//         if (!this.isVisible) return;

//         // Draw background image with parallax effect
//         if (this.backgroundImage.complete) {
//             const time = Date.now() * 0.001;
//             const offsetX = Math.sin(time) * 20;
//             const offsetY = Math.cos(time) * 20;
//             this.context.globalAlpha = 0.3;
//             this.context.drawImage(this.backgroundImage, offsetX, offsetY, this.canvas.width, this.canvas.height);
//             this.context.globalAlpha = 1;
//         }

//         // Draw semi-transparent overlay
//         this.context.fillStyle = 'rgba(0, 0, 0, 0.7)';
//         this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

//         // Animate title
//         this.titleY += (this.targetTitleY - this.titleY) * 0.1;
//         this.buttonsOpacity = Math.min(1, this.buttonsOpacity + 0.02);

//         // Draw particles
//         this.updateParticles();
//         this.drawParticles();

//         // Draw title with glow effect
//         this.context.save();
//         this.context.shadowColor = '#4CAF50';
//         this.context.shadowBlur = 20;
//         this.context.fillStyle = '#fff';
//         this.context.font = 'bold 48px Arial';
//         this.context.textAlign = 'center';
//         this.context.fillText('Bubble Shooter', this.canvas.width/2, this.titleY);
//         this.context.restore();

//         // Draw buttons with animation
//         this.context.globalAlpha = this.buttonsOpacity;
//         this.buttons.forEach(button => {
//             // Animate button scale
//             if (button.hovered) {
//                 button.scale += (1.1 - button.scale) * 0.1;
//             } else {
//                 button.scale += (1 - button.scale) * 0.1;
//             }

//             // Draw button background with scale
//             this.context.save();
//             this.context.translate(button.x, button.y);
//             this.context.scale(button.scale, button.scale);
            
//             // Button gradient
//             const gradient = this.context.createLinearGradient(
//                 -button.width/2, 0,
//                 button.width/2, 0
//             );
//             gradient.addColorStop(0, button.hovered ? '#4CAF50' : '#2E7D32');
//             gradient.addColorStop(1, button.hovered ? '#45a049' : '#1B5E20');
            
//             this.context.fillStyle = gradient;
//             this.context.beginPath();
//             this.context.roundRect(
//                 -button.width/2,
//                 -button.height/2,
//                 button.width,
//                 button.height,
//                 10
//             );
//             this.context.fill();

//             // Button border glow
//             if (button.hovered) {
//                 this.context.shadowColor = '#4CAF50';
//                 this.context.shadowBlur = 15;
//                 this.context.strokeStyle = '#fff';
//                 this.context.lineWidth = 2;
//                 this.context.stroke();
//             }

//             // Button text
//             this.context.fillStyle = '#fff';
//             this.context.shadowBlur = button.hovered ? 10 : 0;
//             this.context.font = '24px Arial';
//             this.context.textAlign = 'center';
//             this.context.textBaseline = 'middle';
//             this.context.fillText(button.text, 0, 0);
//             this.context.restore();
//         });
//         this.context.globalAlpha = 1;

//         requestAnimationFrame(() => this.draw());
//     }

//     updateParticles() {
//         // Add new particles occasionally
//         if (Math.random() < 0.1) {
//             this.particles.push({
//                 x: Math.random() * this.canvas.width,
//                 y: this.canvas.height + 10,
//                 size: Math.random() * 3 + 1,
//                 speedY: -(Math.random() * 2 + 1),
//                 opacity: Math.random() * 0.5 + 0.5
//             });
//         }

//         // Update existing particles
//         this.particles = this.particles.filter(particle => {
//             particle.y += particle.speedY;
//             return particle.y > -10;
//         });
//     }

//     drawParticles() {
//         this.context.save();
//         this.particles.forEach(particle => {
//             this.context.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
//             this.context.beginPath();
//             this.context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
//             this.context.fill();
//         });
//         this.context.restore();
//     }

//     startGame() {
//         this.isVisible = false;
//         this.gameStarted = true;
//     }

//     openSettings() {
//         console.log("Opening settings...");
//     }

//     showInstructions() {
//         console.log("Showing instructions...");
//     }

//     showHighScores() {
//         // Implement high scores display
//         console.log("Showing high scores...");
//     }

//     show() {
//         this.isVisible = true;
//     }

//     hide() {
//         this.isVisible = false;
//     }

//     isGameStarted() {
//         return this.gameStarted;
//     }
// }
