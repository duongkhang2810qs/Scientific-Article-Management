// Đoạn code này định nghĩa một Mongoose Schema cho tài liệu HoiDong (hội đồng) trong cơ sở dữ liệu MongoDB. 
// Schema này mô tả cấu trúc dữ liệu của một hội đồng, bao gồm tên hội đồng, các thành viên (chủ tịch, thư ký, ủy viên), và các cài đặt liên quan.

// Thư viện giúp kết nối và tương tác với cơ sở dữ liệu MongoDB.
// Được sử dụng để định nghĩa Schema và Model.
const mongoose = require("mongoose");
// Kiểu dữ liệu trong MongoDB dùng để tham chiếu đến các tài liệu khác.
// Trong đoạn code này, ObjectId được dùng để liên kết các thành viên của hội đồng (chủ tịch, thư ký, ủy viên) với tài liệu User.
const { ObjectId } = mongoose.Schema.Types;

// Định nghĩa Schema HoiDong
const HoiDong = mongoose.Schema(
  {
    // Lưu tên của hội đồng.
    TenHoiDong: {
      type: String, // kiểu dữ liệu của trường
      required: [true, "cần nhập tên hội đồng!!!"], // bắt buộc phải có tên hội đồng
    },
    ChuTich: {
      type: ObjectId, //Tham chiếu đến tài liệu User (người dùng).
      ref: "User",  //Cho phép sử dụng populate để lấy thông tin chi tiết của người dùng.
      required: [true, "cần nhập chủ tịch"],
    },
    // Lưu ID của người dùng làm thư ký hội đồng
    Thuky: {
      type: ObjectId, //Tham chiếu đến tài liệu User
      ref: "User",  //Cho phép sử dụng populate
      required: [true, "cần nhập thư ký"],
    },
    UyVien1: {
      type: ObjectId, //Tham chiếu đến tài liệu User (người dùng).
      ref: "User",
    },
    UyVien2: {
      type: ObjectId, //Tham chiếu đến tài liệu User (người dùng).
      ref: "User",
    },
  },
  {
    collection: "HoiDong",
    timestamps: true,
  }
);
// Tên của collection trong MongoDB là HoiDong.
const HoiDongModels = mongoose.model("HoiDong", HoiDong);
// Xuất model HoiDongModels để có thể sử dụng trong các phần khác của ứng dụng.
module.exports = HoiDongModels;
