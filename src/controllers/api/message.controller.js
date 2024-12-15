const messageModel = require("../../models/message.model"); // Model Mongoose tương tác với cơ sở dữ liệu cho bảng/collection
const factory = require("./factory");
const catchAsync = require("../../utils/catchAsync");

// Tự động thêm sender (người gửi) vào req.body trước khi tạo hoặc cập nhật tin nhắn.
exports.addSender = catchAsync(async (req, res, next) => {
  req.body.sender = req.user._id;
  next();
});

//Thêm ID của người dùng hiện tại (req.user._id) vào req.query để lọc tin nhắn theo người gửi.
exports.addUserIdToQuery = catchAsync(async (req, res, next) => {
  req.query.sender = req.user._id.toString();
  next();
});

exports.getMessages = factory.getAll(messageModel); //  Lấy danh sách tất cả các tin nhắn, có thể được lọc, sắp xếp, và phân trang.
exports.postMessage = factory.createOne(messageModel);
exports.updateMessage = factory.updateOne(messageModel, true);
exports.deleteMessage = catchAsync(async (req, res, next) => {
  const data = await messageModel.findOneAndDelete({
    _id: req.params.id,
    sender: req.user._id,
  });
  if (!data) return next(new error("No document found with that ID", 404));

  res.status(200).json({
    status: "success",
    data: null,
    deleteCount: deleteMessage.deletedCount,
  });
});
