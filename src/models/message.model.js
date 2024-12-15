// Import thư viện Mongoose để làm việc với MongoDB
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types; // Lấy ObjectId từ Schema.Types

// Định nghĩa schema cho Message (tin nhắn)
const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String, // Nội dung tin nhắn
      trim: true, // Loại bỏ khoảng trắng thừa ở đầu và cuối
    },
    sender: {
      type: ObjectId, // ID của người gửi
      required: true, // Bắt buộc phải có người gửi
      ref: "User", // Liên kết với collection User
    },
    conversation: {
      type: ObjectId, // ID của cuộc trò chuyện chứa tin nhắn này
      required: true, // Bắt buộc phải có cuộc trò chuyện
      ref: "Conversation", // Liên kết với collection Conversation
    },
    videoCall: {
      hasCall: {
        type: Boolean, // Xác định có cuộc gọi video hay không
        default: false, // Mặc định là không có cuộc gọi video
      },
      hasRecording: {
        type: Boolean, // Xác định có ghi âm cuộc gọi hay không
        default: false, // Mặc định là không có ghi âm
      },
    },
    files: [
      {
        type: String, // Danh sách URL của các tệp đính kèm trong tin nhắn
      },
    ],
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
    collection: "Message", // Tên collection trong MongoDB
  }
);

// Middleware trước khi truy vấn find: tự động populate trường sender
messageSchema.pre("find", function (next) {
  this.populate("sender", "name"); // Populate trường sender với thông tin tên
  next(); // Tiếp tục thực hiện truy vấn
});

// Middleware trước khi lưu: tự động populate trường sender
messageSchema.pre("save", function (next) {
  this.populate("sender", "name"); // Populate trường sender với thông tin tên
  next(); // Tiếp tục thực hiện lưu dữ liệu
});

// Tạo model Message dựa trên schema
const Message = mongoose.model("Message", messageSchema);

// Xuất module Message để sử dụng
module.exports = Message;
