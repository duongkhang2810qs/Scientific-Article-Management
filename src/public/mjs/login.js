/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts.js";

// Hàm xử lý đăng nhập
// id: ID người dùng
// password: Mật khẩu người dùng
export const login = async (id, password) => {
  try {
    // Gửi yêu cầu POST đến API đăng nhập
    const res = await axios({
      method: "POST", // Phương thức HTTP POST
      url: "/api/v1/users/login", // URL API đăng nhập
      data: {
        id, // Gửi ID người dùng
        password, // Gửi mật khẩu
      },
    });

    // Kiểm tra phản hồi từ API
    if (res.data.status === "success") {
      showAlert("success", "Đăng nhập thành công!"); // Hiển thị thông báo thành công
      window.setTimeout(() => {
        location.assign("/"); // Chuyển hướng về trang chủ sau 1 giây
      }, 1000);
    } else {
      showAlert("error", "Đăng nhập thất bại. Vui lòng kiểm tra thông tin."); // Hiển thị thông báo lỗi
      window.setTimeout(() => {
        location.assign("/"); // Quay lại trang đăng nhập sau 1 giây
      }, 1000);
    }
  } catch (err) {
    // Xử lý lỗi khi gửi yêu cầu hoặc phản hồi không mong muốn
    showAlert("error", "Đã xảy ra lỗi trong quá trình đăng nhập."); // Hiển thị thông báo lỗi
    console.error(err); // Log lỗi chi tiết
    window.setTimeout(() => {
      location.assign("/"); // Quay lại trang đăng nhập sau 1 giây
    }, 1000);
  }
};

// Hàm xử lý đăng xuất
export const logout = async () => {
  try {
    // Gửi yêu cầu GET đến API đăng xuất
    const res = await axios({
      method: "GET", // Phương thức HTTP GET
      url: "/api/v1/users/logout", // URL API đăng xuất
    });

    // Kiểm tra phản hồi từ API
    if (res.data.status === "success") {
      showAlert("success", "Đăng xuất thành công!"); // Hiển thị thông báo thành công
      window.setTimeout(() => {
        location.assign("/login"); // Chuyển hướng về trang đăng nhập sau 1 giây
      }, 1000);
    }
  } catch (err) {
    showAlert("error", "Đăng xuất không thành công!"); // Hiển thị thông báo lỗi
  }
};
