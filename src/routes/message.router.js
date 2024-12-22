// Import thư viện express để tạo router
const express = require("express");
const Router = express.Router();
// Import controller chứa logic xử lý cho các endpoint liên quan đến "message"
const messageController = require("../controllers/api/message.controller");
// Import middleware kiểm tra xác thực người dùng
const { authMiddleware } = require("../controllers/api/auth.controller");
// Áp dụng middleware `authMiddleware` cho tất cả các route trong router này

// Định nghĩa route cho endpoint "/"
Router.use(authMiddleware);
Router.route("/")
  .get(messageController.addUserIdToQuery, messageController.getMessages)   // Xử lý HTTP GET: Lấy danh sách tin nhắn, thêm userId vào query để lọc dữ liệu
  .post(messageController.addSender, messageController.postMessage);   // Xử lý HTTP POST: Thêm tin nhắn mới, thêm thông tin người gửi vào tin nhắn

  // Định nghĩa route cho endpoint "/:id" (tham chiếu đến một tin nhắn cụ thể bằng id)
Router.route("/:id")
  .patch(messageController.updateMessage)   // Xử lý HTTP PATCH: Cập nhật thông tin tin nhắn
  .delete(messageController.deleteMessage);  // Xử lý HTTP DELETE: Xóa tin nhắn theo id

module.exports = Router; // Xuất module Router để sử dụng trong các file khác
