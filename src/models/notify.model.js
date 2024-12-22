// Đoạn code này định nghĩa một Mongoose Schema cho tài liệu Notify trong MongoDB. 
// Schema này được sử dụng để lưu trữ các thông báo trong ứng dụng, với các trường thông tin như 
// tiêu đề thông báo, nội dung, ngày đăng, file đính kèm, và thời gian tạo.

// Thư viện Node.js dùng để làm việc với MongoDB.
// Được sử dụng để định nghĩa schema và model.
const mongoose = require("mongoose");
// Kiểu dữ liệu trong MongoDB, thường dùng để tham chiếu (reference) đến các tài liệu khác.
// Tuy nhiên, trong schema này không sử dụng ObjectId.
const { ObjectId } = mongoose.Schema.Types;

// Định nghĩa Schema Notify
const Notify = mongoose.Schema(
  {
    // Tiêu đề hoặc tên của thông báo.
    ThongBao: {
      type: String,
      required: [true, "cần nhập tên thông báo!!!"],  //Trường này bắt buộc phải có.
    },
    // Nội dung chi tiết của thông báo.
    NoiDung: {
      type: String,
      required: [true, "cần nhập nội dung!!!"],
    },
    // Ngày đăng thông báo.
    NgayDang: Date,
    file: [],
    createdAt: {
      type: Date, //Kiểu dữ liệu là ngày (Date)
      default: Date.now(),  //Tự động gán giá trị là thời gian hiện tại khi thông báo được tạo.
    },
  },
  {
    collection: "Notify",
    timestamps: true,
  }
);

// Tạo một model Notify từ schema Notify.
// Model này được sử dụng để thực hiện các thao tác CRUD (Create, Read, Update, Delete) trên collection Notify.
const NotifyModels = mongoose.model("Notify", Notify);
// Xuất model NotifyModels để có thể sử dụng ở các phần khác của ứng dụng.
module.exports = NotifyModels;
