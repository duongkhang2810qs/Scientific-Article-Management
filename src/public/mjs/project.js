import axios from "axios";
import { showAlert } from "./alerts.js";

// Hàm tạo đề tài mới
// formData: Đối tượng FormData chứa thông tin đề tài
export const newtopic = async (formData) => {
  try {
    // Gửi yêu cầu POST để tạo đề tài mới
    const res = await axios({
      method: "POST", // Phương thức HTTP POST
      url: "/api/v1/topics", // URL API để tạo đề tài mới
      data: formData, // Gửi dữ liệu đề tài dưới dạng FormData
    });

    // Kiểm tra phản hồi từ API
    if (res.data.status === "success") {
      showAlert("success", "Tạo đề tài thành công!"); // Hiển thị thông báo thành công
      window.setTimeout(() => {
        location.assign("/topics"); // Chuyển hướng về danh sách đề tài sau 1.5 giây
      }, 1500);
    }
  } catch (err) {
    // Log lỗi và hiển thị thông báo lỗi
    console.log(err.response.data.data); // Log chi tiết lỗi
    showAlert("error", err.response.data.error); // Hiển thị thông báo lỗi
  }
};
