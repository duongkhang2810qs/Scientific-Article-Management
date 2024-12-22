import axios from "axios";
import { showAlert } from "./alerts.js";

// Hàm tạo người dùng mới
// id: ID của người dùng
// password: Mật khẩu
// name: Tên người dùng
// role: Vai trò của người dùng
export const newuser = async (id, password, name, role) => {
  try {
    const res = await axios({   // Gửi yêu cầu POST đến API để tạo người dùng mới
      method: "POST", // Phương thức HTTP POST
      url: "/api/v1/users/signup",// Endpoint để đăng ký người dùng mới
      data: {
        id, // ID của người dùng
        password, // Mật khẩu
        name, // Tên người dùng
        role, // Vai trò của người dùng
      },
    });

    // Nếu tạo thành công
    if (res.data.status === "success") {
      showAlert("success", "Signup in successfully!");// Hiển thị thông báo thành công
      window.setTimeout(() => {
        location.assign("/users"); // Chuyển hướng về trang danh sách người dùng sau 1.5 giây
      }, 1500);
    }
  } catch (err) {    // Nếu xảy ra lỗi, hiển thị thông báo lỗi
    console.log(err.response.data.data); // Ghi chi tiết lỗi ra console
    showAlert("error", err.response.data.error); // Hiển thị lỗi từ phản hồi của server
  }
};
