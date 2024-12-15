import axios from "axios";
import { showAlert } from "./alerts.js";

// Hàm tạo thông báo mới
// ThongBao: Tiêu đề thông báo
// NoiDung: Nội dung thông báo
export const new_notify = async (ThongBao, NoiDung) => {
  try {
    // Gửi yêu cầu POST để tạo thông báo mới
    const res = await axios({
      method: "POST", // Phương thức HTTP POST
      url: "/api/v1/notifys", // URL API tạo thông báo
      data: {
        ThongBao, // Gửi tiêu đề thông báo
        NoiDung, // Gửi nội dung thông báo
      },
    });

    // Kiểm tra phản hồi từ API
    if (res.data.status === "success") {
      showAlert("success", "Tạo thông báo thành công!"); // Hiển thị thông báo thành công
      window.setTimeout(() => {
        location.assign("/"); // Chuyển hướng về trang chủ sau 1.5 giây
      }, 1500);
    }
  } catch (err) {
    // Log lỗi và hiển thị thông báo lỗi
    console.log(err.response.data.data); // Log chi tiết lỗi
    showAlert("error", err.response.data.error); // Hiển thị thông báo lỗi
  }
};
