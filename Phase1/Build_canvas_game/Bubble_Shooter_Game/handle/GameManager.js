export class GameManager {
  constructor() {
    this.score = 0;
    this.health = 3; // Mạng ban đầu
    this.state = "playing"; // Possible states: 'playing', 'paused', 'gameOver'
  }

  setState(newState) {
    this.state = newState;
  }

  updateScore(points) {
    this.score += points;
    if (this.score % 100 === 0) {
      // Mỗi khi điểm số chia hết cho 100
      this.increaseSpeed();
    }
  }

  resetGame() {
    this.score = 0;
    this.health = 3;
    this.state = "playing";
  }
}
