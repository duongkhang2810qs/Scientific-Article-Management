// Import thư viện Mongoose để làm việc với MongoDB
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types; // Lấy ObjectId từ Schema.Types

// Định nghĩa schema cho Conversation (cuộc trò chuyện)
const conversationSchema = new mongoose.Schema(
  {
    name: {
      type: String, // Tên của cuộc trò chuyện
      required: [true, "Conversation name is required"], // Bắt buộc phải có tên
      trim: true, // Loại bỏ khoảng trắng thừa ở hai đầu
    },
    participants: [
      {
        type: ObjectId, // Danh sách ID của các user tham gia
        ref: "User", // Liên kết với collection User
        required: true, // Bắt buộc phải có participants
      },
    ],
    isGroup: {
      type: Boolean, // Xác định cuộc trò chuyện có phải nhóm hay không
      default: false, // Mặc định là không phải nhóm
    },
    admin: {
      type: ObjectId, // ID của admin cuộc trò chuyện
      ref: "User", // Liên kết với collection User
    },
    images: [
      {
        type: String, // Danh sách URL của các hình ảnh trong cuộc trò chuyện
      },
    ],
  },
  {
    collection: "Conversation", // Tên collection trong MongoDB
    timestamps: true, // Tự động thêm createdAt và updatedAt
    toJSON: { virtuals: true }, // Cho phép virtual fields xuất hiện khi chuyển đổi sang JSON
    toObject: { virtuals: true }, // Cho phép virtual fields xuất hiện khi chuyển đổi sang Object
  }
);

// Middleware chạy trước mỗi truy vấn find để populate participants và messages
conversationSchema.pre(/^find/, function (next) {
  this.populate("participants", "_id name avatar") // Populate trường participants với các thông tin cơ bản
    .populate("messages"); // Populate messages liên kết với cuộc trò chuyện
  next(); // Tiếp tục thực hiện các bước tiếp theo
});

// Virtual field để liên kết với collection Message
conversationSchema.virtual("messages", {
  ref: "Message", // Tên model liên kết
  foreignField: "conversation", // Trường trong Message liên kết với Conversation
  localField: "_id", // Trường trong Conversation liên kết với Message
});

// Tạo model Conversation dựa trên schema
const Conversation = mongoose.model("Conversation", conversationSchema);

// Xuất module Conversation để sử dụng
module.exports = Conversation;
