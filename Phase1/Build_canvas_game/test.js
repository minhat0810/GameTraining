let a = 1;
let b = 0;  // Biến ngoài để lưu giá trị của a
let c = 0;
// Hàm trả về Promise để đồng bộ hóa sự kiện click
function updateValueOnClick() {
    return new Promise((resolve) => {
        window.addEventListener("click", () => {
            a += 10;  // Cập nhật giá trị a
            b = a;    // Cập nhật giá trị b
            console.log("Giá trị a sau click:", a);
            //console.log("Giá trị b sau khi cập nhật:", b);
            resolve();  // Kết thúc Promise sau khi cập nhật xong
        });
    });
}

// Hàm async để xử lý sự kiện click đồng bộ
async function handleClick() {
    while (true) { 
    console.log("Giá trị b trước khi click:", b);
    await updateValueOnClick();  // Chờ sự kiện click xảy ra và Promise được resolve
    getValue(b);
    }
}

// Gọi hàm handleClick để xử lý
handleClick();
function getValue(b){
   c = b;
}

console.log();


