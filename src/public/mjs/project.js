import axios from "axios";
import { showAlert } from "./alerts.js";

// Hàm tạo đề tài mới
// formData: Dữ liệu của đề tài được gửi dưới dạng FormData
export const newtopic = async (formData) => {
  try {
    const res = await axios({    // Gửi yêu cầu POST đến API để tạo đề tài mới
      method: "POST", // Phương thức HTTP POST
      url: "/api/v1/topics", // Endpoint để tạo đề tài mới
      data: formData, // Dữ liệu của đề tài
    });

    // Nếu tạo thành công
    if (res.data.status === "success") {
      showAlert("success", "tạo đề tài thành công!");// Hiển thị thông báo thành công
      window.setTimeout(() => {
        location.assign("/topics"); // Chuyển hướng về trang danh sách đề tài sau 1.5 giây
      }, 1500);
    }
  } catch (err) {    // Nếu xảy ra lỗi, hiển thị thông báo lỗi
    console.log(err.response.data.data); // Ghi chi tiết lỗi ra console
    showAlert("error", err.response.data.error); // Hiển thị lỗi từ phản hồi của server
  }
};
