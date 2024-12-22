import axios from "axios";
import { showAlert } from "./alerts.js";

// Hàm cập nhật thông tin người dùng
// name: Tên người dùng
// email: Email của người dùng
// gioitinh: Giới tính
// sdt: Số điện thoại
// khoa: Khoa của người dùng
export const changePass = async (name, email, gioitinh, sdt, khoa) => {
  try {    // Gửi yêu cầu PATCH đến API để cập nhật thông tin
    const res = await axios({
      method: "PATCH", // Sử dụng phương thức HTTP PATCH
      url: "api/v1/users/me", // Endpoint để cập nhật thông tin cá nhân
      data: {
        name, // Tên người dùng
        email, // Email người dùng
        gioitinh, // Giới tính
        sdt, // Số điện thoại
        khoa, // Khoa của người dùng
      },
    });

    // Nếu cập nhật thành công
    if (res.data.status === "success") {
      showAlert("success", "Signup in successfully!"); // Hiển thị thông báo thành công
      window.setTimeout(() => {
        location.assign(`/`); // Chuyển hướng về trang chủ sau 1.5 giây
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.error);   // Nếu có lỗi xảy ra, hiển thị thông báo lỗi
  }
};
