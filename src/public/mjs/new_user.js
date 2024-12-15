import axios from "axios";
import { showAlert } from "./alerts.js";

// Hàm tạo người dùng mới
// id: ID người dùng
// password: Mật khẩu người dùng
// name: Tên người dùng
// role: Vai trò của người dùng (admin, giang_vien, sinh_vien)
export const newuser = async (id, password, name, role) => {
  try {
    // Gửi yêu cầu POST để tạo người dùng mới
    const res = await axios({
      method: "POST", // Phương thức HTTP POST
      url: "/api/v1/users/signup", // URL API đăng ký người dùng mới
      data: {
        id, // Gửi ID người dùng
        password, // Gửi mật khẩu
        name, // Gửi tên người dùng
        role, // Gửi vai trò người dùng
      },
    });

    // Kiểm tra phản hồi từ API
    if (res.data.status === "success") {
      showAlert("success", "Đăng ký người dùng thành công!"); // Hiển thị thông báo thành công
      window.setTimeout(() => {
        location.assign("/users"); // Chuyển hướng về danh sách người dùng sau 1.5 giây
      }, 1500);
    }
  } catch (err) {
    // Log lỗi và hiển thị thông báo lỗi
    console.log(err.response.data.data); // Log chi tiết lỗi
    showAlert("error", err.response.data.error); // Hiển thị thông báo lỗi
  }
};
