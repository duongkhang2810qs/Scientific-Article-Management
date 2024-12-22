// Đoạn code này định nghĩa một Mongoose Schema cho tài liệu (collection) Conversation trong MongoDB. 
// Đây là cấu trúc dùng để lưu trữ các cuộc hội thoại trong ứng dụng, với các trường và logic liên quan.

// Thư viện giúp kết nối và tương tác với cơ sở dữ liệu MongoDB.
// Được sử dụng để định nghĩa Schema và Model.
const mongoose = require("mongoose");
// ObjectId:
// Kiểu dữ liệu tham chiếu đến các tài liệu khác (ví dụ: liên kết đến User hoặc Message)
const { ObjectId } = mongoose.Schema.Types;
//  Định nghĩa conversationSchema:
const conversationSchema = new mongoose.Schema( // cấu trúc Schema
  {
    // Tên của cuộc hội thoại.
    name: { 
      type: String, // Kiểu dữ liệu của trường
      required: [true, "Conversation name is required"], // Bắt buộc phải có giá trị
      trim: true, //Loại bỏ khoảng trắng đầu và cuối chuỗi.
    },
    // Mảng chứa các ID của người tham gia cuộc hội thoại.
    participants: [
      {
        type: ObjectId, //Tham chiếu đến tài liệu User.
        ref: "User", // Cho phép sử dụng populate để tự động truy vấn thông tin từ tài liệu User
        required: true, // Bắt buộc phải có giá trị
      },
    ],
    isGroup: {
      type: Boolean, //Boolean xác định liệu cuộc hội thoại có phải là nhóm hay không.
      default: false, //Mặc định là cuộc hội thoại cá nhân.
    },
    // ID của người dùng là admin của nhóm.
    admin: {
      type: ObjectId, // Tham chiếu đến tài liệu User
      ref: "User", // Cho phép sử dụng populate để tự động truy vấn thông tin từ tài liệu User
    },
    // Mảng các đường dẫn (URL) hoặc tên file của ảnh được chia sẻ trong cuộc hội thoại.
    images: [
      {
        type: String,
      },
    ],
  },
  {
    collection: "Conversation", //Tên collection trong MongoDB sẽ là Conversation.
    // Tự động thêm hai trường:
    // createdAt: Thời gian tài liệu được tạo.
    // updatedAt: Thời gian tài liệu được cập nhật lần cuối.
    timestamps: true,
    // Cho phép các trường virtuals (trường ảo) được bao gồm khi chuyển đổi tài liệu thành JSON hoặc Object.
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// Middleware pre(/^find/): Middleware pre chạy trước các truy vấn find. Sử dụng để tự động populate các trường liên kết (participants và messages).
// /^find/: Middleware này áp dụng cho tất cả các truy vấn bắt đầu bằng find
conversationSchema.pre(/^find/, function (next) {
  // Tự động lấy thông tin chi tiết của người tham gia từ tài liệu User
  // Chỉ lấy các trường _id, name, và avatar
  this.populate("participants", "_id name avatar").populate("messages"); // Populate participants field with only _id
  //this.find({ participants: this._conditions.user._id }); // Filter conversations by user ID
  next();
});

// Virtual field messages: Tạo một virtual field tên messages để liên kết với các tài liệu Message
conversationSchema.virtual("messages", {
  ref: "Message", //Tên của model được liên kết (ở đây là Message)
  foreignField: "conversation", //Trường trong tài liệu Message dùng để liên kết (chứa ID của cuộc hội thoại).
  localField: "_id", //Trường trong tài liệu Conversation được dùng để so sánh (ở đây là _id).
});

// Tạo một model Conversation từ schema conversationSchema.
// Model này được sử dụng để thực hiện các thao tác CRUD trên collection Conversation.
const Conversation = mongoose.model("Conversation", conversationSchema);
module.exports = Conversation;
