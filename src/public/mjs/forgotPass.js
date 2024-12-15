/* eslint-disable */
// Import thư viện axios và hàm hiển thị thông báo
import axios from "axios";
import { showAlert } from "./alerts.js";

// Hàm gửi yêu cầu quên mật khẩu
// id: ID của người dùng muốn đặt lại mật khẩu
export const forgotPass = async (id) => {
  try {
    // Gửi yêu cầu POST đến API để yêu cầu đặt lại mật khẩu
    const res = await axios({
      method: "POST", // Phương thức HTTP POST
      url: "/forgotPassword", // Endpoint API để đặt lại mật khẩu
      data: {
        id, // Gửi ID người dùng
      },
    });

    // Kiểm tra phản hồi từ API
    if (res.data.status === "success") {
      showAlert("success", res.data.message); // Hiển thị thông báo thành công
    }
  } catch (err) {
    // Log lỗi chi tiết nếu có
    console.log(err.response.data.data);
    // Hiển thị thông báo lỗi từ phản hồi API
    showAlert("error", err.response.data.data.message);
  }
};
