const express = require("express"); // Import thư viện express để tạo router
const councilController = require("../controllers/api/council.controller.js"); // Import controller chứa logic xử lý cho các endpoint liên quan đến "council"
// Import middleware kiểm tra xác thực và giới hạn quyền truy cập
const {
  authMiddleware, // Kiểm tra người dùng đã đăng nhập
  restrictTo, // Giới hạn quyền truy cập cho một số vai trò cụ thể
} = require("../controllers/api/auth.controller.js");

const Router = express.Router(); // Tạo một đối tượng Router từ express

// Định nghĩa route cho endpoint "/"
Router.route("/")
  .get(councilController.getcouncils) // Xử lý HTTP GET: Lấy danh sách các hội đồng
  .post(authMiddleware, councilController.postcouncil); // Xử lý HTTP POST: Tạo mới một hội đồng (yêu cầu xác thực)

// Định nghĩa route cho endpoint "/:id" (tham chiếu tới một hội đồng cụ thể bằng id)
Router.route("/:id")
  .get(councilController.getcouncil)   // Xử lý HTTP GET: Lấy thông tin chi tiết một hội đồng
  .patch(authMiddleware, councilController.updatecouncil)  // Xử lý HTTP PATCH: Cập nhật thông tin một hội đồng (yêu cầu xác thực)
  .delete(authMiddleware, restrictTo("admin"), councilController.deletecouncil);  // Xử lý HTTP DELETE: Xóa một hội đồng (yêu cầu xác thực và quyền admin)
module.exports = Router; // Xuất module Router để sử dụng trong các file khác
