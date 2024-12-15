// Import hàm tiện ích xử lý lỗi bất đồng bộ
const catchAsync = require("../utils/catchAsync");

// Middleware để thêm ID của người dùng hiện tại vào query
exports.addUserIdToQuery = catchAsync(async (req, res, next) => {
  req.query.participants = req.user._id.toString(); // Gắn ID người dùng hiện tại vào tham số query "participants"
  next(); // Tiếp tục đến middleware hoặc controller tiếp theo
});
