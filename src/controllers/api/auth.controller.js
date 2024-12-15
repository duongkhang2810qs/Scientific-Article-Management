// XÁC THỰC VÀ QUẢN LÝ TÀI KHOẢN NGƯỜI DÙNG 

const userModels = require("../../models/user.model.js"); // tương tác với database 
const catchAsync = require("../../utils/catchAsync.js"); // xử lý lỗi bất đồng bộ
const jwt = require("jsonwebtoken"); // thư viện tạo và xác minh Json web tokens, dùng để xác thực người dùng
const error = require("../../utils/error.js"); // tạo lỗi tùy chỉnh 
const sendEmail = require("../../utils/email.js"); // gửi email (smtp or dịch vụ email api)
const crypto = require("crypto"); //module built-in Node.js mã hóa token đặt lại mật khẩu 


const createSendToken = (user, statusCode, req, res) => {
  const id = user._id; // Sử dụng jsonwebtoken để tạo token với  user._id
  const token = jwt.sign({ id }, process.env.JWT_KEY, {
    expiresIn: process.env.EXPIRES,
  });

  res.cookie("jwt", token, { // Cài đặt cookie: JWT được lưu trong cookie với tùy chọn httpOnly để tăng bảo mật.
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });

  //Loại bỏ mật khẩu: user.password = undefined để không trả mật khẩu trong response
  user.password = undefined; 
  // Gửi response: Trả về trạng thái thành công cùng token và thông tin người dùng.
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.login = catchAsync(async (req, res, next) => {
  const { id, password } = req.body;
  const user = await userModels.findOne({ id });
  //check user and password
  if (!user || !(await user.checkPassword(password)))
    return next(new error("kiểm tra lại tài khoản hoặc mật khẩu", 201));

  //gửi res, token cho user
  createSendToken(user, 200, req, res);
});

exports.createUser = catchAsync(async (req, res, next) => {
  const user = await userModels.create(req.body); // Tạo user mới: Lưu thông tin user từ req.body vào database.
  user.password = undefined; // Ẩn mật khẩu: Xóa trường password khỏi response.
  res.status(200).json({ // Gửi response: Trả thông tin user cùng trạng thái thành công.
    status: "success",
    data: {
      user,
    },
  });
});

// Đăng xuất
exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", { // Ghi đè JWT trong cookie bằng giá trị "loggedout".
    expires: new Date(Date.now() + 10 * 1000), // Đặt thời gian hết hạn ngắn (10 giây).
    httpOnly: true,
  });

  req.user.jwtExpires = Date.now() - 1000;
  req.user.save();
  res.status(200).json({ status: "success" });
}; // Cập nhật user: Ghi nhận việc hết hạn token trong database.

exports.authMiddleware = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there 
  // xác minh token: lấy token từ header or cookie
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new error("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verification token: 
  const decoded = jwt.verify(token, process.env.JWT_KEY);

  // 3) Check user 
  const currentUser = await userModels.findById(decoded.id);
  if (!currentUser) {
    return next(
      new error("The user belonging to this token does no longer exist.", 401)
    );
  }

  // 4) Check if tokenExpires nếu token hết hạn 
  if (currentUser.checkjwtExpires(decoded.iat)) {
    return next(new error(" Please log in again.", 401));
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  // Gán user vào req: Nếu hợp lệ, gán thông tin user vào req.user để dùng cho các middleware khác.
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});
// Giới hạn quyền: Chỉ cho phép các user có vai trò (role) được chỉ định truy cập.
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new error("Bạn không có quyền thực hiện hành động này", 403));
    }

    next();
  };
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { password, newPassword } = req.body;
  if (!password || !newPassword)
    return next(new error("Vui lòng nhập password hoặc newPassword", 201));
  const user = await userModels.findById(req.user._id);
  //check user and password
  if (!user || !(await user.checkPassword(password)))
    return next(new error("password không đúng", 201));

  user.password = newPassword;
  await user.save();
  //gửi res, token cho user
  createSendToken(user, 200, req, res);
});

// Tạo token đặt lại mật khẩu, gửi email cho người dùng.
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { id } = req.body;
  const user = await userModels.findOne({ id });
  if (!user) return next(new error("Không tìm thấy tài khoản", 201));

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Đặt lại mật khẩu của bạn bằng cách nhấp vào đường link này: ${resetURL}\nLink có hiệu lực trong 10 phút.\nNếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Đặt lại mật khẩu",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "check email for reset password",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new error("There was an error sending the email. Try again later!", 500)
    );
  }
});

// Xác minh token từ URL, đặt lại mật khẩu và lưu lại.
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await userModels.findOne({
    resetToken: hashedToken,
    resetTokenExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new error("Token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, req, res);
});
