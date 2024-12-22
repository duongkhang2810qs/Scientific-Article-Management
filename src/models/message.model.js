// Đoạn code này định nghĩa một Mongoose Schema cho tài liệu Message trong MongoDB. 
// Message đại diện cho các tin nhắn được gửi trong một ứng dụng chat hoặc giao tiếp, bao gồm nội dung tin nhắn, 
// thông tin người gửi, cuộc hội thoại liên quan, và các tính năng khác như video call hoặc file đính kèm.

// Thư viện Node.js để làm việc với MongoDB.
// Dùng để định nghĩa schema và model.
const mongoose = require("mongoose");
// ObjectId:
// Kiểu dữ liệu trong MongoDB, được dùng để tham chiếu (reference) đến các tài liệu khác, 
// như User hoặc Conversation trong trường hợp này.
const { ObjectId } = mongoose.Schema.Types;

// Định nghĩa messageSchema
const messageSchema = new mongoose.Schema(
  {
    // Nội dung tin nhắn.
    message: {
      type: String,
      trim: true, //Tự động loại bỏ khoảng trắng ở đầu và cuối chuỗi.
    },
    // Lưu ID của người gửi tin nhắn.
    sender: {
      type: ObjectId, //Tham chiếu đến tài liệu User
      required: true, //Bắt buộc phải có.
      ref: "User",  //Cho phép sử dụng populate để tự động truy vấn thông tin người dùng từ tài liệu User.
    },
    conversation: {
      type: ObjectId, //Tham chiếu đến tài liệu Conversation.
      required: true,
      ref: "Conversation",  //Cho phép sử dụng populate để tự động truy vấn thông tin cuộc hội thoại.
    },
    // Chứa các thuộc tính liên quan đến cuộc gọi video.
    videoCall: {
      hasCall: {
        type: Boolean,  //Xác định xem có cuộc gọi video hay không.
        default: false, //Mặc định không có cuộc gọi video.
      },
      hasRecording: {
        type: Boolean,  //Xác định xem cuộc gọi video có ghi âm không.
        default: false, //Mặc định không có ghi âm.
      },
    },
    // Lưu danh sách các file đính kèm trong tin nhắn.
    files: [
      {
        type: String, //Mỗi phần tử trong mảng là một chuỗi (ví dụ: đường dẫn file).
      },
    ],
  },
  {
    timestamps: true,
    collection: "Message",  //ên của collection trong MongoDB là Message.
  }
);

// Middleware của Schema

// Trước khi thực hiện truy vấn find, middleware này tự động populate trường sender.
// Chỉ lấy các trường name từ tài liệu User.
// Middleware này chạy khi gọi các truy vấn như find, findOne.
messageSchema.pre("find", function (next) {
  this.populate("sender", "name");
  next();
});

// Trước khi lưu một tin nhắn mới, middleware này tự động populate trường sender.
// Chỉ lấy trường name từ tài liệu User.
// Middleware này chạy khi tạo hoặc lưu mới một tài liệu (save).
messageSchema.pre("save", function (next) {
  this.populate("sender", "name");
  next();
});

// Tạo một model Message từ schema messageSchema.
// Model này được sử dụng để thực hiện các thao tác CRUD trên collection Message
const Message = mongoose.model("Message", messageSchema);

// Xuất model Message để sử dụng trong các phần khác của ứng dụng.
module.exports = Message;


