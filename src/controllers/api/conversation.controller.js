// KIỂM TRA TỒN TẠI, TẠO MỚI, SỬA ĐỔI, XÓA HOẶC LẤY THÔNG TIN CÁC CUỘC TRÒ CHUYỆN

const catchAsync = require("../../utils/catchAsync"); // Hàm tiện ích giúp bắt lỗi khi xử lý các hàm async/await.
const error = require("../../utils/error");
const conversationModel = require("../../models/conversation.model"); // Tương tác với cơ sở dữ liệu các cuộc trò chuyện.
const messageModel = require("../../models/message.model"); // Tương tác với cơ sở dữ liệu tin nhắn.
const factory = require("./factory"); // Module chứa các phương thức CRUD chung như getAll, createOne, updateOne, getOne.

// Kiểm tra xem cuộc trò chuyện đã tồn tại hay chưa 
exports.conversationExists = catchAsync(async (req, res, next) => {
  console.log(req.body);
  if (req.body.isGroup === true) {
    req.body.admin = req.user._id; // Thêm user hiện tại vào danh sách participants.
    req.body.participants = req.body.participants.concat(req.user._id); // Tiếp tục tới middleware tiếp theo.

    return next();
  }
  // xử lý chat riêng (private)
  const data = await conversationModel.findOne({
    isGroup: false,
    participants: { $all: [req.user._id, req.body.recipient] },
  });
  
  // nếu không tìm thấy
  if (!data) {
    req.body.name = "conversation name"; // gán thông tin mặc định vào req.body
    req.body.participants = [req.user._id, req.body.recipient];
    req.body.isGroup = false;
    console.log(req.body);
    return next(); // tiếp tục middleware tiếp 
  }
  // nếu tìm thấy trả về thông tin trò chuyện trong response
  res.status(200).json({
    status: "success",
    data,
  });
});
exports.getConversations = factory.getAll(conversationModel); // Lấy danh sách tất cả các cuộc trò chuyện
exports.getConversation = factory.getOne(conversationModel, true); // Lấy thông tin chi tiết của một cuộc trò chuyện cụ thể.
exports.postConversation = factory.createOne(conversationModel); // Tạo mới một cuộc trò chuyện.
exports.updateConversation = factory.updateOne(conversationModel, true); // Cập nhật thông tin của một cuộc trò chuyện.

// Xóa một cuộc trò chuyện nhóm.
exports.deleteConversation = catchAsync(async (req, res, next) => {
  const data = await conversationModel.findOneAndDelete({
    _id: req.params.id,
    admin: req.user._id,
    isGroup: true,
  });
  // đk xóa: _id của cuộc trò chuyện phải khớp với req.params.id
  // User hiện tại phải là admin của nhóm.
  if (!data) return next(new error("No document found with that ID", 404));
  const deleteMessage = await messageModel.deleteMany({
    conversation: req.params.id,
  });

  // Trả về trạng thái thành công cùng số lượng tin nhắn đã bị xóa (deleteCount).
  res.status(200).json({ 
    status: "success",
    data: null,
    deleteCount: deleteMessage.deletedCount,
  });
});
