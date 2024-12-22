// Đoạn code này định nghĩa một Mongoose Schema cho tài liệu Topic trong MongoDB. 
// Topic đại diện cho một đề tài nghiên cứu hoặc dự án, với các thông tin như 
// tên đề tài, mô tả, thành viên tham gia, trạng thái, kinh phí, ngày bắt đầu và ngày kết thúc.

// Thư viện Node.js để làm việc với MongoDB, được sử dụng để định nghĩa schema và model.
const mongoose = require("mongoose");
// Kiểu dữ liệu trong MongoDB, thường dùng để tham chiếu (reference) đến các tài liệu khác,
const { ObjectId } = mongoose.Schema.Types;

//  Định nghĩa Schema TopicSchema:

const TopicSchema = mongoose.Schema(
  {
    //  Lưu danh sách các thành viên tham gia đề tài.
    ThanhVien: [
      {
        type: ObjectId, //Tham chiếu đến tài liệu User.
        ref: "User",  //Cho phép sử dụng populate để tự động truy vấn thông tin từ tài liệu User.
      },
    ],
    //Tên hoặc tiêu đề của đề tài nghiên cứu.
    TenDeTai: {
      type: String, //Kiểu dữ liệu là chuỗi.
      required: [true, "cần nhập tên đề tài!!!"],
    },
    //Mô tả chi tiết về đề tài.
    MoTa: {
      type: String,
      required: [true, "cần nhập mô tả!!!"],
    },
    GhiChu: String,
    MaNganh: {
      type: String,
      required: [true, "vui lòng nhập mã ngành"],
    },
    KetQua: String,
    //Trạng thái hiện tại của đề tài.
    TrangThai: {
      type: String,
      enum: [
        "phân công xét duyệt",
        "đang xét duyệt",
        "đang thực hiện",
        "phân công duyệt bài báo",
        "đang duyệt bài báo",
        "hoàn thành",
        "hủy",
      ],
      default: "phân công xét duyệt", //Mặc định là "phân công xét duyệt"
    },
    NhanXet: String,
    KinhPhi: Number,
    Diem: Number,
    GiangVien: {
      type: ObjectId,
      ref: "User",
    },
    HoiDong: {
      type: ObjectId,  // Tham chiếu đến tài liệu HoiDong
      ref: "HoiDong",  // Cho phép sử dụng populate.
    },
    NgayThucHien: Date,
    NgayKetThuc: Date,
    file: [], //Danh sách file đính kèm.
  },
  {
    collection: "Topic",
    timestamps: true,
  }
);
// Tạo model Topic từ schema TopicSchema.
// Model này được sử dụng để thực hiện các thao tác CRUD trên collection Topic.
const ReseachModels = mongoose.model("Topic", TopicSchema);
// Xuất model ReseachModels để sử dụng trong các phần khác của ứng dụng
module.exports = ReseachModels;
