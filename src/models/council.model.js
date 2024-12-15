// Import thư viện Mongoose để làm việc với MongoDB
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types; // Lấy ObjectId từ Schema.Types

// Định nghĩa schema cho HoiDong (hội đồng)
const HoiDong = mongoose.Schema(
  {
    TenHoiDong: {
      type: String, // Tên hội đồng
      required: [true, "cần nhập tên hội đồng!!!"], // Bắt buộc phải nhập tên hội đồng
    },
    ChuTich: {
      type: ObjectId, // ID của chủ tịch hội đồng
      ref: "User", // Liên kết với collection User
      required: [true, "cần nhập chủ tịch"], // Bắt buộc phải nhập chủ tịch
    },
    Thuky: {
      type: ObjectId, // ID của thư ký hội đồng
      ref: "User", // Liên kết với collection User
      required: [true, "cần nhập thư ký"], // Bắt buộc phải nhập thư ký
    },
    UyVien1: {
      type: ObjectId, // ID của ủy viên 1
      ref: "User", // Liên kết với collection User
    },
    UyVien2: {
      type: ObjectId, // ID của ủy viên 2
      ref: "User", // Liên kết với collection User
    },
  },
  {
    collection: "HoiDong", // Tên collection trong MongoDB
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Tạo model HoiDong dựa trên schema
const HoiDongModels = mongoose.model("HoiDong", HoiDong);

// Xuất module HoiDongModels để sử dụng
module.exports = HoiDongModels;
