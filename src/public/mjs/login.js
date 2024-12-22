/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts.js";

// Hàm đăng nhập
// id: ID của người dùng
// password: Mật khẩu
export const login = async (id, password) => {
  try {    // Gửi yêu cầu POST đến API để thực hiện đăng nhập
    const res = await axios({
      method: "POST", // Phương thức HTTP POST
      url: "/api/v1/users/login", // Endpoint để đăng nhập
      data: {
        id, // Gửi ID người dùng
        password, // Gửi mật khẩu
      },
    });

        // Nếu đăng nhập thành công
    if (res.data.status === "success") {
      showAlert("success", "Logged in successfully!"); // Hiển thị thông báo thành công
      window.setTimeout(() => {
        location.assign("/"); // Chuyển hướng về trang chủ sau 1 giây
      }, 1000);
    } else {
      showAlert("error", "Login failed. Please check your credentials.");// Nếu thất bại, hiển thị thông báo lỗi
      window.setTimeout(() => {
        location.assign("/");
      }, 1000);
    }
  } catch (err) {
    // Handle network errors or unexpected server responses
    showAlert("error", "An error occurred during the login process.");    // Xử lý lỗi mạng hoặc phản hồi không mong muốn từ server
    console.error(err);
    window.setTimeout(() => {
      location.assign("/");
    }, 1000);
  }
};

// Hàm đăng xuất
export const logout = async () => {
  try {    // Gửi yêu cầu GET đến API để thực hiện đăng xuất
    const res = await axios({
      method: "GET", // Phương thức HTTP GET
      url: "/api/v1/users/logout", // Endpoint để đăng xuất
    });

    // Nếu đăng xuất thành công
    if (res.data.status === "success") {
      showAlert("success", "Đăng xuất thành công!"); // Hiển thị thông báo thành công
      window.setTimeout(() => {
        location.assign("/login"); // Chuyển hướng về trang đăng nhập sau 1 giây
      }, 1000);
    }
  } catch (err) {    // Nếu xảy ra lỗi khi đăng xuất, hiển thị thông báo lỗi
    showAlert("error", "Đăng xuất không thành công!");
  }
};
