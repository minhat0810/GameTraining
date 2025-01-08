    // Hàm DFS duyệt qua các quả bóng cùng màu trong game
    function dfs(row, col, bubbles, visited, ball, mapData) {
    const gridRows = mapData.length; // Số hàng của mảng
    const gridCols = mapData[0].length; // Số cột của mảng

    const key = `${row},${col}`;

    // Kiểm tra xem vị trí này đã được duyệt chưa
    if (visited.has(key)) return;
    visited.add(key);

    // In ra key và trạng thái visited
    console.log(key);
    console.log(visited);

    // Kiểm tra điều kiện biên
    if (
        row < 0 ||
        row >= gridRows ||
        col < 0 ||
        col >= gridCols ||
        mapData[row][col] === undefined
    ) {
        return;
    }

    // Các hướng di chuyển (Trên, Dưới, Trái, Phải)
    const directions = [
        [-1, 0], // Trên
        [1, 0], // Dưới
        [0, -1], // Trái
        [0, 1], // Phải
    ];

    // Duyệt qua các hướng
    for (const [dx, dy] of directions) {
        // Gọi đệ quy cho các vị trí lân cận
        this.dfs(row + dx, col + dy, bubbles, visited, ball, mapData);
    }
    }

    // Ví dụ dữ liệu cho mapData, visited và ball
    let mapData = [
    ["red", "green", "blue", "red"],
    ["green", "red", "blue", "green"],
    ["blue", "red", "green", "green"],
    ["red", "blue", "green", "red"],
    ];
    let visited = new Set();
    let ball = "red"; // Màu của quả bóng hiện tại, có thể thay đổi tùy vào game logic

    // Bắt đầu tìm kiếm từ vị trí (0, 0)
    dfs(0, 0, ball, visited, ball, mapData);
