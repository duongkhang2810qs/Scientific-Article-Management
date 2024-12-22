/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts.js";

// Hàm đặt lại mật khẩu
// password: Mật khẩu mới
export const resetPass = async (password) => {
  try {
    const token = window.location.pathname.split("/")[2];    // Lấy token từ URL hiện tại
    const res = await axios({    // Gửi yêu cầu PATCH đến API để đặt lại mật khẩu
      method: "PATCH", // Phương thức HTTP PATCH
      url: `/api/v1/users/resetPassword/${token}`, // Endpoint để đặt lại mật khẩu với token
      data: {
        password, // Gửi mật khẩu mới
      },
    });

    // Nếu đặt lại mật khẩu thành công
    if (res.data.status === "success") {
      showAlert("success", "Đổi mật khẩu thành công"); // Hiển thị thông báo thành công
    }
  } catch (err) {    // Nếu xảy ra lỗi, hiển thị thông báo lỗi
    showAlert("error", "Đổi mật khẩu thất bại");
  }
};
