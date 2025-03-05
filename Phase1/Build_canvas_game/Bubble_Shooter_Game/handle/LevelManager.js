import { gameState, mapDatas } from "../main/index.js";
import { CollisionManager } from "../handle/CollisionManager.js";

export class LevelManager {
  constructor(canvas,context) {
    this.canvas = canvas;
    this.context = context;
    this.level = 1;
    this.opacity = 1;
    this.transition = false;
    this.transitionAlpha = 0;
    this.isTransitioning = false;
  }

  increaseLevel() {
    this.level += 1;
    return
  }
  endLevel() {
   // console.log("j");
    
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = `rgba(0, 0, 0, ${this.opacity})`;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.fillStyle = "#fff";
    this.context.font = "40px Robo";
    this.context.textAlign = "center";
    this.context.fillText(
      `Level completed`,
      this.canvas.width / 2,
      this.canvas.height / 2
    );
    gameState.setShoot(false);
    setTimeout(()=>{
          gameState.setShoot(true);
    },1000);
  }

  drawLevel(lvl){
    // console.log(this.level);
    // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
   //  this.context.fillStyle = `rgba(0, 0, 0, ${this.opacity})`;
    // this.context.fillRect(0, 0, 100, 50);

     this.context.fillStyle = "#fff";
     this.context.font = "35px Robo";
     this.context.textAlign = "center";
     this.context.fillText(
       `Level ${lvl}`,
       this.canvas.width / 2,
       25
     );
     this.level = lvl;
     return this.level;
  }
//   startLevelTransition() {
//     if (!this.isTransitioning) {
//       this.isTransitioning = true;
//       this.transitionAlpha = 0;
//       this.fadeOut();
//     }
//   }

//   fadeOut() {
//     if (this.transitionAlpha < 1) {
//       this.transitionAlpha += 0.01;
//       this.context.fillStyle = `rgba(0, 0, 0, ${this.transitionAlpha})`;
//       this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
//       requestAnimationFrame(() => this.fadeOut());
//     } else {
//       this.currentLevel += 1;
//       gameState.nextLevel(false);
//        const collisionManager = new CollisionManager();
//        const map = new Map(this.context, 20, collisionManager, this.canvas);
//       map.loadMap();
//       this.fadeIn();
//     }
//   }

//   fadeIn() {
//     if (this.transitionAlpha > 0) {
//       this.transitionAlpha -= 0.01;
//       this.context.fillStyle = `rgba(0, 0, 0, ${this.transitionAlpha})`;
//       this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
//       requestAnimationFrame(() => this.fadeIn());
//     } else {
//       this.isTransitioning = false;
//     }
//   }
}
