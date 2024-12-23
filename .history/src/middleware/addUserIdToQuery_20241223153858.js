//- thêm user ID của người dùng đã đăng nhập vào query strin
const catchAsync = require("../utils/catchAsync");
exports.addUserIdToQuery = catchAsync(async (req, res, next) => {
  req.query.participants = req.user._id.toString();
  next();
});
