import axios from "axios";
import { showAlert } from "./alerts.js";

// Hàm thay đổi mật khẩu
// password: Mật khẩu hiện tại của người dùng
// newPassword: Mật khẩu mới mà người dùng muốn đặt
export const changePass = async (password, newPassword) => {
  try { // Gửi yêu cầu PATCH đến API để thay đổi mật khẩu
    const res = await axios({
      method: "PATCH", // Phương thức HTTP PATCH
      url: "/api/v1/users/updatePassword", // Endpoint để thay đổi mật khẩu
      data: {
        password, // Gửi mật khẩu hiện tại
        newPassword, // Gửi mật khẩu mới
      },
    });

    // Kiểm tra nếu thay đổi mật khẩu thành công
    if (res.data.status === "success") {
      showAlert("success", "Signup in successfully!"); // Hiển thị thông báo thành công
      window.setTimeout(() => {
        location.assign(`./`); // Chuyển hướng về trang chủ sau 1.5 giây
      }, 1500);
    }
  } catch (err) {    // Nếu xảy ra lỗi, hiển thị thông báo lỗi
    showAlert("error", err.response.data.error);
  }
};
