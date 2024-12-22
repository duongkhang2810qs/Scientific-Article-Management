const express = require("express"); // Import thư viện express để tạo router
const notifyController = require("../controllers/api/notify.controller.js"); // Import controller chứa logic xử lý cho các endpoint liên quan đến "notify"
// Import middleware kiểm tra xác thực và giới hạn quyền truy cập
const {
  authMiddleware, // Kiểm tra người dùng đã đăng nhập
  restrictTo, // Giới hạn quyền truy cập cho một số vai trò cụ 
} = require("../controllers/api/auth.controller.js");

const Router = express.Router();// Tạo một đối tượng Router từ express

// Định nghĩa route cho endpoint "/"
Router.route("/")
  .get(notifyController.getNotifys)  // Xử lý HTTP GET: Lấy danh sách thông báo
  .post(authMiddleware, notifyController.postNotify);  // Xử lý HTTP POST: Tạo mới một thông báo (yêu cầu xác thực)

  // Định nghĩa route cho endpoint "/:id" (tham chiếu tới một thông báo cụ thể bằng id)
Router.route("/:id")
  .get(notifyController.getNotify)  // Xử lý HTTP GET: Lấy thông tin chi tiết một thông báo
  .patch(authMiddleware, notifyController.updateNotify)  // Xử lý HTTP PATCH: Cập nhật thông tin một thông báo (yêu cầu xác thực)
  .delete(authMiddleware, restrictTo("admin"), notifyController.deleteNotify);  // Xử lý HTTP DELETE: Xóa một thông báo (yêu cầu xác thực và quyền admin)
module.exports = Router;// Xuất module Router để sử dụng trong các file khác
