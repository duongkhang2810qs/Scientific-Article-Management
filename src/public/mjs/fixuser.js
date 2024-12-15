// Import thư viện axios và hàm hiển thị thông báo
import axios from "axios";
import { showAlert } from "./alerts.js";

// Hàm cập nhật thông tin người dùng
// name: Tên người dùng
// email: Email người dùng
// gioitinh: Giới tính của người dùng
// sdt: Số điện thoại người dùng
// khoa: Khoa của người dùng
export const changePass = async (name, email, gioitinh, sdt, khoa) => {
  try {
    // Gửi yêu cầu PATCH để cập nhật thông tin người dùng
    const res = await axios({
      method: "PATCH", // Phương thức HTTP PATCH
      url: "api/v1/users/me", // URL API cập nhật thông tin người dùng hiện tại
      data: {
        name, // Gửi tên người dùng
        email, // Gửi email
        gioitinh, // Gửi giới tính
        sdt, // Gửi số điện thoại
        khoa, // Gửi thông tin khoa
      },
    });

    // Kiểm tra phản hồi từ API
    if (res.data.status === "success") {
      showAlert("success", "Cập nhật thông tin thành công!"); // Hiển thị thông báo thành công
      window.setTimeout(() => {
        location.assign(`/`); // Chuyển hướng về trang chủ sau 1.5 giây
      }, 1500);
    }
  } catch (err) {
    // Nếu xảy ra lỗi, hiển thị thông báo lỗi
    showAlert("error", err.response.data.error);
  }
};
