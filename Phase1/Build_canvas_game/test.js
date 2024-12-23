class BallPrediction {
    constructor() {
        this.items = []; // Khởi tạo mảng
    }

    enqueue(element) {
        this.items.push(element); // Thêm phần tử vào cuối hàng đợi
    }

    dequeue() {
        if (this.isEmpty()) {
            return "Queue is empty"; // Trả về thông báo nếu hàng đợi rỗng
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

const queue = new BallPrediction();
const colors = ['red', 'blue', 'green', 'yellow', 'purple'];

function getRandomColor() {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

// Tạo 3 quả bóng đầu tiên
queue.enqueue(getRandomColor());
queue.enqueue(getRandomColor());
queue.enqueue(getRandomColor());

queue.print(getRandomColor());

window.addEventListener("click", () => {
    // Đổi màu nền thành quả bóng đầu tiên
    const firstBall = queue.dequeue(); // Lấy và xóa quả bóng đầu tiên
    document.body.style.backgroundColor = firstBall;

    // Thêm quả bóng mới vào hàng đợi
    const nextBall = getRandomColor();
    queue.enqueue(nextBall);

    // In trạng thái hàng đợi
    queue.print();
});
