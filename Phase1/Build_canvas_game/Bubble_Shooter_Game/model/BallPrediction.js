export class BallPrediction {
  constructor() {
    this.items = [];
  }

  enqueue(element) {
    this.items.push(element);
  }

  dequeue() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.items.shift(); 
  }

  isEmpty() {
    return this.items.length === 0; 
  }

  front() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.items[0]; 
  }

  size() {
    return this.items.length; 
  }

  clear() {
    this.items = []; 
  }

  print() {
    console.log(this.items.toString());
  }
}
