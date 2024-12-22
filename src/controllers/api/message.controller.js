// Model MongoDB đại diện cho tài liệu message (tin nhắn), chứa các thông tin như nội dung, người gửi, thời gian gửi, cuộc hội thoại liên quan, v.v.
const messageModel = require("../../models/message.model");
// Module chứa các hàm tái sử dụng cho CRUD (Create, Read, Update, Delete), có thể áp dụng cho nhiều model khác nhau.
const factory = require("./factory");
// Một wrapper để xử lý lỗi bất đồng bộ trong các hàm async/await, giúp chuyển lỗi đến middleware xử lý lỗi.
const catchAsync = require("../../utils/catchAsync");

// Middleware addSender: Tự động gắn ID của người gửi (sender) vào req.body trước khi tạo tin nhắn mới.
// Khi người dùng gửi tin nhắn mới, middleware này đảm bảo rằng trường sender được tự động điền bằng ID của người dùng hiện tại.
exports.addSender = catchAsync(async (req, res, next) => { // Lấy thông tin người dùng hiện tại từ req.user._id
  // Gắn giá trị sender vào req.body
  req.body.sender = req.user._id;
  // Chuyển tiếp yêu cầu đến middleware tiếp theo bằng next()
  next();
});
// Middleware addUserIdToQuery: Gắn ID của người dùng hiện tại (sender) vào truy vấn (req.query) để chỉ lấy các tin nhắn của họ.
exports.addUserIdToQuery = catchAsync(async (req, res, next) => {
  req.query.sender = req.user._id.toString();
  next();
});

exports.getMessages = factory.getAll(messageModel); //Lấy danh sách tất cả các tin nhắn.
exports.postMessage = factory.createOne(messageModel); //Sử dụng factory.getAll để áp dụng các tính năng như lọc, sắp xếp, chọn trường, và phân trang.
exports.updateMessage = factory.updateOne(messageModel, true); //Tạo mới một tin nhắn.
// Xóa một tin nhắn do người dùng gửi.
exports.deleteMessage = catchAsync(async (req, res, next) => {
//   Sử dụng findOneAndDelete với điều kiện:
// _id: ID của tin nhắn (từ req.params.id).
// sender: Phải là người gửi hiện tại (req.user._id).
  const data = await messageModel.findOneAndDelete({
    _id: req.params.id,
    sender: req.user._id,
  });
  // Kiểm tra dữ liệu: Nếu không tìm thấy tin nhắn phù hợp, trả về lỗi 404.
  if (!data) return next(new error("No document found with that ID", 404));
  // Trả về trạng thái "success" và dữ liệu null.
  res.status(200).json({
    status: "success",
    data: null,
    deleteCount: deleteMessage.deletedCount,
  });
});
