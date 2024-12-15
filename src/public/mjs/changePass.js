// Import thư viện axios để thực hiện các yêu cầu HTTP
import axios from "axios";
// Import hàm hiển thị thông báo
import { showAlert } from "./alerts.js";

// Hàm thay đổi mật khẩu
// password: mật khẩu cũ
// newPassword: mật khẩu mới
export const changePass = async (password, newPassword) => {
  try {
    // Gửi yêu cầu PATCH để thay đổi mật khẩu
    const res = await axios({
      method: "PATCH", // Phương thức HTTP
      url: "/api/v1/users/updatePassword", // URL API để thay đổi mật khẩu
      data: {
        password, // Mật khẩu cũ
        newPassword, // Mật khẩu mới
      },
    });

    // Kiểm tra phản hồi nếu thành công
    if (res.data.status === "success") {
      showAlert("success", "Signup in successfully!"); // Hiển thị thông báo thành công
      window.setTimeout(() => {
        location.assign(`./`); // Chuyển hướng về trang chủ sau 1.5 giây
      }, 1500);
    }
  } catch (err) {
    // Nếu xảy ra lỗi, hiển thị thông báo lỗi
    showAlert("error", err.response.data.error);
  }
};
