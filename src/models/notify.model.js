// Import thư viện Mongoose để làm việc với MongoDB
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types; // Lấy ObjectId từ Schema.Types

// Định nghĩa schema cho Notify (thông báo)
const Notify = mongoose.Schema(
  {
    ThongBao: {
      type: String, // Tiêu đề của thông báo
      required: [true, "cần nhập tên thông báo!!!"], // Bắt buộc phải nhập tiêu đề
    },
    NoiDung: {
      type: String, // Nội dung của thông báo
      required: [true, "cần nhập nội dung!!!"], // Bắt buộc phải nhập nội dung
    },
    NgayDang: {
      type: Date, // Ngày đăng thông báo
    },
    file: [
      {
        type: String, // Danh sách URL của các file đính kèm
      },
    ],
    createdAt: {
      type: Date, // Ngày tạo thông báo
      default: Date.now(), // Mặc định là ngày giờ hiện tại
    },
  },
  {
    collection: "Notify", // Tên collection trong MongoDB
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Tạo model Notify dựa trên schema
const NotifyModels = mongoose.model("Notify", Notify);

// Xuất module NotifyModels để sử dụng
module.exports = NotifyModels;
