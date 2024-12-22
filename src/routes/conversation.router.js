const express = require("express"); // Import thư viện express để tạo router
const conversationController = require("../controllers/api/conversation.controller"); // Import controller chứa logic xử lý cho các endpoint liên quan đến "conversation"
const { authMiddleware } = require("../controllers/api/auth.controller"); // Import middleware dùng để kiểm tra xác thực người dùng
const { addUserIdToQuery } = require("../middleware/addUserIdToQuery"); // Import middleware thêm userId vào truy vấn để gắn dữ liệu với người dùng
const Router = express.Router(); // Tạo một đối tượng Router từ express

// Middleware `authMiddleware` được sử dụng cho tất cả các route trong router này
// Đảm bảo mọi request phải thông qua kiểm tra xác thực trước khi xử lý tiếp
Router.use(authMiddleware); 

// Định nghĩa route cho endpoint "/"
Router.route("/")
  // Xử lý HTTP GET: Lấy danh sách các cuộc trò chuyện của người dùng hiện tại
  .get(addUserIdToQuery, conversationController.getConversations) // Middleware thêm userId vào query để lọc các cuộc trò chuyện thuộc người dùng và  Hàm xử lý trả về danh sách cuộc trò chuyện
  // Xử lý HTTP POST: Tạo mới một cuộc trò chuyện 
  .post(
    conversationController.conversationExists, // Middleware kiểm tra xem cuộc trò chuyện đã tồn tại chưa
    conversationController.postConversation // Hàm xử lý tạo mới một cuộc trò chuyện
  );

// Định nghĩa route cho endpoint "/:id" (dùng id để tham chiếu một cuộc trò chuyện cụ thể)
Router.route("/:id") 
  .get(conversationController.getConversation) // Xử lý HTTP GET: Lấy thông tin chi tiết một cuộc trò chuyện theo id
  .patch(conversationController.updateConversation) // Xử lý HTTP PATCH: Cập nhật thông tin một cuộc trò chuyện
  .delete(conversationController.deleteConversation); // Xử lý HTTP DELETE: Xóa một cuộc trò chuyện theo id

// Xuất module Router để có thể sử dụng trong các file khác
module.exports = Router;
