// Định nghĩa class `error`, kế thừa từ class `Error` có sẵn trong JavaScript
class error extends Error {
  // Hàm khởi tạo (constructor) được gọi khi tạo một instance mới của `error`
  constructor(message, statusCode) {
    // Gọi hàm khởi tạo của class `Error` và truyền thông điệp lỗi (message)
    super(message);

    // Thêm thuộc tính `statusCode` để lưu mã trạng thái HTTP
    this.statusCode = statusCode;

    // Xác định trạng thái dựa trên mã trạng thái:
    // - Nếu mã trạng thái bắt đầu bằng "4" (ví dụ: 400, 404), trạng thái là "fail"
    // - Nếu không, trạng thái là "error"
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
  }
}

// Xuất class `error` để sử dụng ở các file khác
module.exports = error;
