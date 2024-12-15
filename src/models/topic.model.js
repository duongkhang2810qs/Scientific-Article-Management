// Import thư viện Mongoose để làm việc với MongoDB
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types; // Lấy ObjectId từ Schema.Types

// Định nghĩa schema cho Topic (đề tài nghiên cứu)
const TopicSchema = mongoose.Schema(
  {
    ThanhVien: [
      {
        type: ObjectId, // ID của các thành viên tham gia
        ref: "User", // Liên kết với collection User
      },
    ],
    TenDeTai: {
      type: String, // Tên của đề tài
      required: [true, "cần nhập tên đề tài!!!"], // Bắt buộc phải có tên đề tài
    },
    MoTa: {
      type: String, // Mô tả chi tiết đề tài
      required: [true, "cần nhập mô tả!!!"], // Bắt buộc phải có mô tả
    },
    GhiChu: {
      type: String, // Ghi chú thêm về đề tài
    },
    MaNganh: {
      type: String, // Mã ngành của đề tài
      required: [true, "vui lòng nhập mã ngành"], // Bắt buộc phải có mã ngành
    },
    KetQua: {
      type: String, // Kết quả của đề tài
    },
    TrangThai: {
      type: String, // Trạng thái hiện tại của đề tài
      enum: [
        "phân công xét duyệt",
        "đang xét duyệt",
        "đang thực hiện",
        "phân công nghiệm thu",
        "đang nghiệm thu",
        "hoàn thành",
        "hủy",
      ], // Các trạng thái hợp lệ của đề tài
      default: "phân công xét duyệt", // Giá trị mặc định
    },
    NhanXet: {
      type: String, // Nhận xét về đề tài
    },
    KinhPhi: {
      type: Number, // Kinh phí dự kiến của đề tài
    },
    Diem: {
      type: Number, // Điểm đánh giá của đề tài
    },
    GiangVien: {
      type: ObjectId, // ID của giảng viên hướng dẫn
      ref: "User", // Liên kết với collection User
    },
    HoiDong: {
      type: ObjectId, // ID của hội đồng xét duyệt
      ref: "HoiDong", // Liên kết với collection HoiDong
    },
    NgayThucHien: {
      type: Date, // Ngày bắt đầu thực hiện đề tài
    },
    NgayKetThuc: {
      type: Date, // Ngày kết thúc đề tài
    },
    file: [
      {
        type: String, // Danh sách URL của các file liên quan
      },
    ],
  },
  {
    collection: "Topic", // Tên collection trong MongoDB
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Tạo model Topic dựa trên schema
const ReseachModels = mongoose.model("Topic", TopicSchema);

// Xuất module ReseachModels để sử dụng
module.exports = ReseachModels;
