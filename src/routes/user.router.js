const express = require("express");// Import thư viện express để tạo router
// Import các controller xử lý logic liên quan đến người dùng và xác thực
const usercontroller = require("../controllers/api/user.controller.js");
const authcontroller = require("../controllers/api/auth.controller.js");
const {// Import middleware xác thực và giới hạn quyền truy cập
  authMiddleware,
  restrictTo,
} = require("../controllers/auth.controller.js");
const Router = express.Router();// Tạo một đối tượng Router từ express
Router.get("/mee", (req, res) => {// Route kiểm tra kết nối với server
  console.log("f");
  res.status(200).json("Hello from the server");
});
Router.route("/login").post(authcontroller.login);// Định nghĩa route cho chức năng đăng nhập
Router.route("/signup").post(authcontroller.createUser);// Định nghĩa route cho chức năng đăng ký
Router.route("/forgotPassword").post(authcontroller.forgotPassword);// Định nghĩa route cho chức năng quên mật khẩu
Router.patch("/resetPassword/:token", authcontroller.resetPassword);// Định nghĩa route cho chức năng đặt lại mật khẩu

Router.use(authcontroller.authMiddleware);// Áp dụng middleware xác thực cho các route bên dưới
Router.route("/logout").get(authcontroller.logout);// Định nghĩa route cho chức năng đăng xuất
Router.route("/updatePassword").patch(authcontroller.updatePassword);// Định nghĩa route cho chức năng cập nhật mật khẩu
Router.route("/me")// Định nghĩa route cho thông tin người dùng hiện tại
  .get(usercontroller.getMe, usercontroller.getUser) // Lấy thông tin cá nhân
  .patch(// Cập nhật thông tin cá nhân
    usercontroller.uploadUserPhoto, // Upload ảnh người dùng
    usercontroller.updateMe, // Cập nhật thông tin cá nhân
    usercontroller.updateUser // Cập nhật thông tin trên hệ thống
  )
  .delete(usercontroller.deleteMe); // Xóa tài khoản cá nhân

// Router.route("/users/:id")
//   .get(usercontroller.getUser)
//   .delete(authMiddleware, restrictTo("admin"), usercontroller.deleteUser);
Router.route("/").get(usercontroller.getUsers);// Định nghĩa route cho danh sách người dùng
Router.route("/:id")// Định nghĩa route cho các thao tác trên người dùng cụ thể theo id
  .get(usercontroller.getUser) // Lấy thông tin người dùng
  .patch( // Cập nhật thông tin người dùng
    restrictTo("admin"), // Chỉ admin mới có quyền
    usercontroller.uploadUserPhoto, // Upload ảnh người dùng
    usercontroller.updateUser // Cập nhật thông tin người dùng
  )
  .delete(authMiddleware, restrictTo("admin"), usercontroller.deleteUser); // Xóa người dùng (chỉ admin)

module.exports = Router;// Xuất module Router để sử dụng trong các file khác
