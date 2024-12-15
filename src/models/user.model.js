// Import các thư viện cần thiết
const mongoose = require("mongoose"); // Làm việc với MongoDB
const validator = require("validator"); // Kiểm tra dữ liệu đầu vào, ví dụ email
const bcrypt = require("bcryptjs"); // Hash mật khẩu
const crypto = require("crypto"); // Tạo mã token
const { ObjectId } = mongoose.Schema.Types; // Lấy ObjectId từ Schema.Types

// Định nghĩa schema cho User
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String, // Tên người dùng
      required: [true, "cần nhập tên"], // Bắt buộc phải có tên
    },
    id: {
      type: String, // Mã định danh người dùng
      unique: true, // Đảm bảo không trùng lặp
      required: [true, "cần id"], // Bắt buộc phải có ID
    },
    email: {
      type: String, // Email của người dùng
      unique: true, // Đảm bảo email không trùng lặp
      sparse: true, // Cho phép giá trị null hoặc không trùng lặp
      lowercase: true, // Chuyển email thành chữ thường
      validate: [validator.isEmail, "email không hợp lệ"], // Kiểm tra email hợp lệ
    },
    role: {
      type: String, // Vai trò của người dùng
      enum: ["admin", "giang_vien", "sinh_vien"], // Các giá trị hợp lệ
      default: "sinh_vien", // Giá trị mặc định
    },
    ngaysinh: {
      type: Date, // Ngày sinh của người dùng
    },
    gioitinh: {
      type: Boolean, // Giới tính: true = Nam, false = Nữ
    },
    sdt: String, // Số điện thoại
    khoa: String, // Khoa của người dùng
    trinhdo: String, // Trình độ học vấn
    avatar: {
      type: String, // URL ảnh đại diện
      default: "default.jpg", // Giá trị mặc định
    },
    password: {
      type: String, // Mật khẩu
      required: [true, "cần mật khẩu"], // Bắt buộc phải có mật khẩu
      minLength: [6, "Tối thiểu 6 kí tự"], // Độ dài tối thiểu
    },
    status: {
      type: String, // Trạng thái người dùng
      enum: ["active", "block"], // Các giá trị hợp lệ
    },
    DeTai: [
      {
        type: ObjectId, // ID các đề tài mà user tham gia
        ref: "Topic", // Liên kết với collection Topic
      },
    ],
    resetToken: String, // Token đặt lại mật khẩu
    resetTokenExpires: Date, // Thời hạn của token đặt lại mật khẩu
    jwtExpires: Date, // Thời hạn của JWT
  },
  {
    collection: "User", // Tên collection trong MongoDB
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Middleware trước khi lưu để hash mật khẩu
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Nếu mật khẩu không thay đổi, bỏ qua
  this.password = await bcrypt.hash(this.password, 12); // Hash mật khẩu với bcrypt
  next(); // Tiếp tục middleware tiếp theo
});

// Kiểm tra token JWT có hết hạn không
userSchema.methods.checkjwtExpires = function (jwtIat) {
  if (this.jwtExpires) {
    const jwtExpires = parseInt(this.jwtExpires.getTime() / 1000, 10); // Chuyển thời gian JWT hết hạn sang giây
    return jwtExpires > jwtIat; // So sánh thời gian
  }
  return false;
};

// Kiểm tra mật khẩu khi đăng nhập
userSchema.methods.checkPassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password); // So sánh mật khẩu nhập vào và mật khẩu đã hash
};

// Tạo token đặt lại mật khẩu
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex"); // Tạo token ngẫu nhiên
  this.resetToken = crypto
    .createHash("sha256") // Hash token với thuật toán SHA-256
    .update(resetToken)
    .digest("hex");

  this.resetTokenExpires = Date.now() + 10 * 60 * 1000; // Đặt thời hạn token là 10 phút
  return resetToken; // Trả về token ban đầu
};

// Tạo model User dựa trên schema
const UserModels = mongoose.model("User", userSchema);

// Xuất module UserModels để sử dụng
module.exports = UserModels;
