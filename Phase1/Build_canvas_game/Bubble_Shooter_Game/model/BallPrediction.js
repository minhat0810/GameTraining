export class BallPrediction {
  constructor() {
    this.items = []; // Khởi tạo mảng
  }

  enqueue(element) {
    this.items.push(element); // Thêm phần tử vào cuối hàng đợi
  }

  dequeue() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.items.shift(); // Lấy phần tử đầu tiên và xóa nó khỏi mảng
  }

  isEmpty() {
    return this.items.length === 0; // Kiểm tra hàng đợi có rỗng không
  }

  front() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.items[0]; // Lấy phần tử đầu mà không xóa
  }

  size() {
    return this.items.length; // Trả về kích thước hàng đợi
  }

  clear() {
    this.items = []; // Xóa tất cả phần tử
  }

  print() {
    console.log(this.items.toString()); // In ra hàng đợi
  }
}
