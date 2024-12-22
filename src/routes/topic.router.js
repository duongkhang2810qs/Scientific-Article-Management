const express = require("express"); // Import thư viện express để tạo router
const topicController = require("../controllers/api/topic.controller.js"); // Import controller chứa logic xử lý cho các endpoint liên quan đến "topic"
// Import middleware kiểm tra xác thực và giới hạn quyền truy cập
const {
  authMiddleware, // Kiểm tra người dùng đã đăng nhập
  restrictTo, // Giới hạn quyền truy cập cho một số vai trò cụ thể
} = require("../controllers/api/auth.controller.js");

const Router = express.Router();// Tạo một đối tượng Router từ express

// Định nghĩa route cho endpoint "/"
Router.route("/")
  .get(topicController.getTopics)  // Xử lý HTTP GET: Lấy danh sách các chủ đề
  .post(authMiddleware, topicController.uploadFiles, topicController.postTopic);  // Xử lý HTTP POST: Tạo mới một chủ đề (yêu cầu xác thực và tải file nếu có)

  // Định nghĩa route cho endpoint "/:id" (tham chiếu tới một chủ đề cụ thể bằng id)
Router.route("/:id")
  .get(authMiddleware, topicController.getTopic)  // Xử lý HTTP GET: Lấy thông tin chi tiết một chủ đề (yêu cầu xác thực)
    // Xử lý HTTP PATCH: Cập nhật thông tin một chủ đề (yêu cầu xác thực, kiểm tra vai trò và tải file nếu có)
  .patch(
    authMiddleware,
    topicController.filterByRole, // Kiểm tra quyền theo vai trò của người dùng
    topicController.uploadFiles, // Tải file nếu có
    topicController.updateTopic // Thực hiện cập nhật chủ đề
  )
  .delete(authMiddleware, restrictTo("admin"), topicController.deleteTopic);// Xử lý HTTP DELETE: Xóa một chủ đề (yêu cầu xác thực và quyền admin)
module.exports = Router;// Xuất module Router để sử dụng trong các file khác
