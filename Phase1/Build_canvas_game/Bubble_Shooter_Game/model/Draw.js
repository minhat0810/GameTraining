import { bubble } from "../main/index.js";
import { CircleCollider } from "./CircleCollider.js";
import { CollisionManager } from "../handle/CollisionManager.js";

export class Draw {
  constructor(context, map, ballRadius, collisionManager) {
    this.context = context;
    this.map = map;
    this.ballRadius = ballRadius;
    this.collisionManager = collisionManager;
    this.colors = ["red", "blue", "green", "yellow", "purple"];
  }

  drawShooter(shooter) {
    if (shooter.imgPlayerR && shooter.imgPlayerR.complete) {
      this.context.drawImage(
        shooter.imgPlayerR,
        shooter.x,
        shooter.y,
        shooter.width,
        shooter.height
      );
    } else {
      this.context.fillStyle = "white";
      this.context.fillRect(
        shooter.x,
        shooter.y,
        shooter.width,
        shooter.height
      );
    }
  }

  drawPrediction(shooter, mouseX, mouseY, canvas, ballRadius) {
    const points = shooter.calculatePrediction(
      mouseX,
      mouseY,
      canvas,
      ballRadius
    );

    this.context.save();
    this.context.beginPath();
    this.context.moveTo(shooter.x + shooter.width / 2, shooter.y);

    for (const point of points) {
      this.context.lineTo(point.x, point.y);
    }

    this.context.lineWidth = 2;
    this.context.setLineDash([5, 5]);
    this.context.stroke();
    this.context.restore();
  }

  drawBullet(bullet) {
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
      context.arc(this.x, this.y + this.radius, this.radius, 0, 2 * Math.PI);
      context.fillStyle = this.color; // Dùng màu sắc được truyền vào
      context.fill();
      context.lineWidth = 2; // Độ dày của viền
      context.strokeStyle = "black"; // Màu viền
      context.stroke();
    }
  }
  async drawGrid(cellSize, gridPath, ballRadius) {
    // Đọc dữ liệu JSON từ file
    await this.map.loadFromJSON(gridPath);

    // Duyệt qua lưới và vẽ các quả bóng lên canvas
    // for (let y = 0; y < this.map.grid.length; y++) {
    //   for (let x = 0; x < this.map.grid[y].length; x++) {
    //     const ballColorIndex = this.map.getBall(x, y);
    //     if (ballColorIndex !== null) {
    //       // Chọn màu cho quả bóng dựa trên colorIndex
    //       const color = this.getColorByIndex(ballColorIndex);
    //     }
    //   }
    // }
    if (!this.map.grid || this.map.grid.length === 0) {
      throw new Error("Grid không được tải đúng.");
    }

    for (let row = 0; row < this.map.grid.length; row++) {
      for (let col = 0; col < this.map.grid[row].length; col++) {
        const obj = this.map.grid[row][col];
        const offsetX = row % 2 === 0 ? 0 : ballRadius; // Dịch ngang cho hàng lẻ
        const x = col * ballRadius * 2 + ballRadius + offsetX;
        const y = row * ballRadius * 2 + ballRadius - ballRadius;
        const color = this.colors[obj.colorIndex - 1]; // Lấy màu từ mảng colors

        // Vẽ đối tượng tùy theo type
        if (obj.type === "bubble") {
          let circle = new CircleCollider(x, y, ballRadius, null, color, 0, 0);
          bubble.addBubbles(circle);
          this.collisionManager.addCollider(circle);
        }
      }
    }
  }
}
