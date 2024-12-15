import axios from "axios";

// Hàm gửi tin nhắn
// formData: Đối tượng FormData chứa nội dung tin nhắn
exports.sendMessage = async (formData) => {
  try {
    // Gửi yêu cầu POST để tạo tin nhắn mới
    const res = await axios({
      method: "POST", // Phương thức HTTP POST
      url: "/api/v1/messages", // URL API để gửi tin nhắn
      data: formData, // Gửi dữ liệu tin nhắn dưới dạng FormData
    });

    // Hiển thị dữ liệu tin nhắn trong console
    console.log([...formData]);

    // Kiểm tra phản hồi từ API
    if (res.data.status === "success") {
      console.log("Tin nhắn đã được gửi thành công");
    }
  } catch (err) {
    // Log lỗi nếu xảy ra
    console.log("Lỗi khi gửi tin nhắn:", err);
  }
};
