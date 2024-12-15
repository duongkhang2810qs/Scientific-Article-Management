/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts.js";

// Hàm đặt lại mật khẩu
// password: Mật khẩu mới
export const resetPass = async (password) => {
  try {
    // Lấy token từ URL
    const token = window.location.pathname.split("/")[2];

    // Gửi yêu cầu PATCH để đặt lại mật khẩu
    const res = await axios({
      method: "PATCH", // Phương thức HTTP PATCH
      url: `/api/v1/users/resetPassword/${token}`, // URL API đặt lại mật khẩu kèm token
      data: {
        password, // Gửi mật khẩu mới
      },
    });

    // Kiểm tra phản hồi từ API
    if (res.data.status === "success") {
      showAlert("success", "Đổi mật khẩu thành công"); // Hiển thị thông báo thành công
    }
  } catch (err) {
    // Hiển thị thông báo lỗi nếu có
    showAlert("error", "Đổi mật khẩu thất bại");
  }
};
