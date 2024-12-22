// Wrapper để xử lý các hàm bất đồng bộ, giúp tự động bắt lỗi và chuyển chúng đến middleware xử lý lỗi.
const catchAsync = require("../../utils/catchAsync");
// Một lớp lỗi tùy chỉnh để trả về các thông báo lỗi có cấu trúc.
const error = require("../../utils/error");
// Model MongoDB đại diện cho một cuộc hội thoại, chứa các thông tin như danh sách người tham gia, admin, tên cuộc hội thoại, v.v.
const conversationModel = require("../../models/conversation.model");
// Model MongoDB đại diện cho tin nhắn, chứa các thông tin như nội dung tin nhắn, người gửi, cuộc hội thoại liên quan, v.v.
const messageModel = require("../../models/message.model");
// Tập hợp các hàm CRUD (Create, Read, Update, Delete) tái sử dụng được áp dụng cho nhiều model.
const factory = require("./factory");
// Middleware conversationExists: Tạo dữ liệu cuộc hội thoại mới nếu chưa tồn tại hoặc trả về dữ liệu cuộc hội thoại nếu đã tồn tại.
exports.conversationExists = catchAsync(async (req, res, next) => {
  console.log(req.body);
  // Nếu req.body.isGroup === true (là cuộc hội thoại nhóm):
  if (req.body.isGroup === true) {
    req.body.admin = req.user._id; //Gán req.user._id làm admin
    // Thêm req.user._id vào danh sách participants
    req.body.participants = req.body.participants.concat(req.user._id); 
    // Chuyển sang middleware tiếp theo (return next())
    return next();
  }
  // Tìm cuộc hội thoại không phải nhóm (isGroup: false) với hai người tham gia là req.user._id và req.body.recipient.
  const data = await conversationModel.findOne({
    isGroup: false,
    participants: { $all: [req.user._id, req.body.recipient] },
  });
  // Nếu không tìm thấy cuộc hội thoại cá nhân:
  if (!data) {
    // Gán các giá trị mặc định
    req.body.name = "conversation name"; //Tên cuộc hội thoại: "conversation name"
    req.body.participants = [req.user._id, req.body.recipient]; //Danh sách người tham gia: [req.user._id, req.body.recipient]
    req.body.isGroup = false; //Gán isGroup = false
    console.log(req.body);
    //Chuyển sang middleware tiếp theo (return next()).
    return next();
  }
  // Trả về dữ liệu cuộc hội thoại với trạng thái HTTP 200
  res.status(200).json({
    status: "success",
    data,
  });
});
// Lấy danh sách tất cả các cuộc hội thoại.
exports.getConversations = factory.getAll(conversationModel);
// Lấy thông tin chi tiết của một cuộc hội thoại dựa trên ID.
exports.getConversation = factory.getOne(conversationModel, true);
// Tạo mới một cuộc hội thoại.
exports.postConversation = factory.createOne(conversationModel);
// Cập nhật thông tin của một cuộc hội thoại dựa trên ID.
exports.updateConversation = factory.updateOne(conversationModel, true);

// Xóa một cuộc hội thoại nhóm (isGroup: true).
// Chỉ admin mới được phép xóa.
exports.deleteConversation = catchAsync(async (req, res, next) => {
// Tìm cuộc hội thoại với các điều kiện:
// _id: ID của cuộc hội thoại.
// admin: Phải là admin (người tạo cuộc hội thoại).
// isGroup: Phải là nhóm.
  const data = await conversationModel.findOneAndDelete({
    _id: req.params.id,
    admin: req.user._id,
    isGroup: true,
  });
  // Nếu không tìm thấy, trả về lỗi 404.
  if (!data) return next(new error("No document found with that ID", 404));
  const deleteMessage = await messageModel.deleteMany({ //Sử dụng messageModel.deleteMany để xóa tất cả tin nhắn trong cuộc hội thoại vừa xóa.
    conversation: req.params.id,
  });
  //Trả về phản hồi với trạng thái "success", dữ liệu null, và số lượng tin nhắn đã bị xóa.
  res.status(200).json({
    status: "success",
    data: null,
    deleteCount: deleteMessage.deletedCount, //Đếm số lượng tin nhắn đã bị xóa (deleteMessage.deletedCount).
  });
});
