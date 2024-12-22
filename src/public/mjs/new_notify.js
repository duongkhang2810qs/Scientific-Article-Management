import axios from "axios";
import { showAlert } from "./alerts.js";

// Hàm tạo thông báo mới
// ThongBao: Tiêu đề của thông báo
// NoiDung: Nội dung của thông báo
export const new_notify = async (ThongBao, NoiDung) => {
  try {    // Gửi yêu cầu POST đến API để tạo thông báo mới
    const res = await axios({
      method: "POST", // Phương thức HTTP POST
      url: "/api/v1/notifys", // Endpoint để tạo thông báo
      data: {
        ThongBao, // Tiêu đề của thông báo
        NoiDung, // Nội dung của thông báo
      },
    });

    // Nếu tạo thành công
    if (res.data.status === "success") {
      showAlert("success", "Notify in successfully!"); // Hiển thị thông báo thành công
      window.setTimeout(() => {
        location.assign("/"); // Chuyển hướng về trang chủ sau 1.5 giây
      }, 1500);
    }
  } catch (err) {    // Nếu xảy ra lỗi, hiển thị thông báo lỗi
    console.log(err.response.data.data); // Ghi lỗi chi tiết ra console
    showAlert("error", err.response.data.error); // Hiển thị lỗi từ phản hồi của server
  }
};
