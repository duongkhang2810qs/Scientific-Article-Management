/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts.js";

// Hàm xử lý quên mật khẩu
// id: ID của người dùng
export const forgotPass = async (id) => {
  try {   // Gửi yêu cầu POST đến API để khởi tạo quy trình quên mật khẩu
    const res = await axios({
      method: "POST", // Phương thức HTTP POST
      url: "/forgotPassword", // Endpoint để xử lý quên mật khẩu
      data: {
        id, // Gửi ID người dùng
      },
    });

    // Nếu yêu cầu thành công
    if (res.data.status === "success") {
      showAlert("success", res.data.message); // Hiển thị thông báo thành công
    }
  } catch (err) {
    console.log(err.response.data.data); // Ghi lỗi ra console
    showAlert("error", err.response.data.data.message); // Hiển thị thông báo lỗi
  }
};
