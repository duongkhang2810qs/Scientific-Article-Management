import axios from "axios";

// Hàm gửi tin nhắn
// formData: Dữ liệu của tin nhắn được gửi dưới dạng FormData
exports.sendMessage = async (formData) => {
  try {    // Gửi yêu cầu POST đến API để gửi tin nhắn
    const res = await axios({
      method: "POST", // Phương thức HTTP POST
      url: "/api/v1/messages", // Endpoint để gửi tin nhắn
      data: formData, // Dữ liệu tin nhắn được gửi
    });

    // In dữ liệu của FormData ra console
    console.log([...formData]);

    // Nếu tin nhắn được gửi thành công
    if (res.data.status === "success") {
      console.log("ó"); // Ghi log "ó" khi gửi thành công
    }
  } catch (err) {    // Nếu xảy ra lỗi, in thông báo lỗi ra console
    console.log("error", err);
  }
};
