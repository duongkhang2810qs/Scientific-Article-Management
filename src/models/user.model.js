// Đoạn code này định nghĩa một Mongoose Schema cho tài liệu User trong MongoDB. 
// Đây là cấu trúc dùng để quản lý thông tin người dùng trong hệ thống, bao gồm tên,
//  email, vai trò, mật khẩu, và các phương thức xác thực như kiểm tra mật khẩu hoặc 
// tạo token đặt lại mật khẩu.

// Thư viện Node.js để làm việc với MongoDB, được sử dụng để định nghĩa schema và model.
const mongoose = require("mongoose");
// Thư viện để kiểm tra và xác thực chuỗi, ví dụ: kiểm tra định dạng email.
const validator = require("validator");
// Thư viện để mã hóa mật khẩu (hashing) và so sánh mật khẩu đã mã hóa.
const bcrypt = require("bcryptjs");
// Module tích hợp trong Node.js, dùng để tạo token ngẫu nhiên hoặc mã hóa dữ liệu.
const crypto = require("crypto");
// Kiểu dữ liệu MongoDB, thường dùng để tham chiếu (reference) đến các tài liệu khác, như Topic.
const { ObjectId } = mongoose.Schema.Types;

// Định nghĩa Schema userSchema
const userSchema = new mongoose.Schema(
  {
    // Lưu tên người dùng.
    name: {
      type: String, //Kiểu dữ liệu là chuỗi.
      required: [true, "cần nhập tên"], //Bắt buộc phải nhập tên.
    },
    // ID duy nhất cho người dùng.
    id: {
      type: String, //Kiểu dữ liệu là chuỗi.
      unique: true, //Không được trùng lặp
      required: [true, "cần id"], //Bắt buộc phải nhập tên.
    },
    //Địa chỉ email của người dùng.
    email: {
      type: String, //Kiểu dữ liệu là chuỗi.
      unique: true, //Không được trùng lặp.
      sparse: true, //Cho phép null nhưng vẫn duy trì tính duy nhất.
      lowercase: true,  //Chuyển email thành chữ thường
      validate: [validator.isEmail, "email không hợp lệ"],  //Sử dụng validator.isEmail để kiểm tra định dạng email.
    },
    // Vai trò của người dùng.
    role: {
      type: String, //Kiểu dữ liệu là chuỗi.
      enum: ["admin", "giang_vien", "sinh_vien"], // Chỉ nhận giá trị trong danh sách "admin", "giang_vien", "sinh_vien"
      default: "sinh_vien", //Giá trị mặc định là "sinh_vien".
    },
    ngaysinh: {
      type: Date,
    },
    gioitinh: {
      type: String,
      // type: Boolean,
    },
    sdt: String,
    khoa: String,
    trinhdo: String,
    // Ảnh đại diện người dùng.
    avatar: {
      type: String,
      default: "default.jpg", //Giá trị mặc định là "default.jpg".
    },
    // Mật khẩu của người dùng.
    password: {
      type: String, //Kiểu dữ liệu là chuỗi.
      required: [true, "cần mật khẩu"], // Bắt buộc phải nhập.
      minLength: [6, "Tối thiểu 6 kí tự"],  //Độ dài tối thiểu là 6 ký tự
    },
    // Trạng thái tài khoản.
    status: {
      type: String, //Kiểu dữ liệu là chuỗi.
      enum: ["active", "block"],  //Chỉ nhận giá trị "active" hoặc "block"
    },
    // Danh sách các đề tài liên quan đến người dùng.
    DeTai: [
      {
        type: ObjectId, //Tham chiếu đến tài liệu Topic.
        ref: "Topic", //Cho phép sử dụng populate.
      },
    ],
    // Token đặt lại mật khẩu và thời gian hết hạn.
    resetToken: String,
    resetTokenExpires: Date,
    // Thời gian hết hạn của token JWT.
    jwtExpires: Date,
  },
  {
    collection: "User",
    timestamps: true,
  }
);

// Tự động mã hóa mật khẩu trước khi lưu nếu trường password bị thay đổi.
userSchema.pre("save", async function (next) {
  // Kiểm tra xem trường password có bị sửa đổi không
  if (!this.isModified("password")) return next();
  // this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Kiểm tra xem token JWT có hết hạn không.
userSchema.methods.checkjwtExpires = function (jwtIat) {
  if (this.jwtExpires) {
    const jwtExpires = parseInt(this.jwtExpires.getTime() / 1000, 10);
    // So sánh thời gian hết hạn (jwtExpires) với thời gian tạo token (jwtIat).
    return jwtExpires > jwtIat;
  }
  return false;
};

// Kiểm tra xem mật khẩu nhập vào có khớp với mật khẩu đã lưu không.
userSchema.methods.checkPassword = async function (inputPassword) {
  // return await bcrypt.compare(inputPassword, this.password);
  return inputPassword === this.password; //So sánh mật khẩu nhập (inputPassword) với mật khẩu đã lưu (this.password).
};

// Tạo token đặt lại mật khẩu và lưu token đã mã hóa trong tài liệu.
userSchema.methods.createPasswordResetToken = function () {
  // Tạo token ngẫu nhiên (resetToken) bằng crypto.
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetToken = crypto
    .createHash("sha256")
    // Mã hóa token và lưu vào trường resetToken.
    .update(resetToken)
    .digest("hex");
  // Gán thời gian hết hạn cho resetTokenExpires (10 phút kể từ thời điểm hiện tại).
  this.resetTokenExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

// Tạo model User từ schema userSchema.
// Model này được sử dụng để thực hiện các thao tác CRUD trên collection User
const UserModels = mongoose.model("User", userSchema);
// Xuất model UserModels để sử dụng trong các phần khác của ứng dụng.
module.exports = UserModels;
