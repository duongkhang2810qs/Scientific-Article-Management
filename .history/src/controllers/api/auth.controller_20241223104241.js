const userModels = require("../../models/user.model.js"); //  Model đại diện cho tài liệu User trong MongoDB.
const catchAsync = require("../../utils/catchAsync.js"); // Wrapper để xử lý các hàm bất đồng bộ, giúp tự động bắt lỗi và chuyển chúng đến middleware xử lý lỗi.
const jwt = require("jsonwebtoken"); //Được sử dụng để tạo và xác minh các mã thông báo JWT ( Json Web Token).
const error = require("../../utils/error.js"); // Một lớp lỗi tùy chỉnh để trả về các thông báo lỗi có cấu trúc.
const sendEmail = require("../../utils/email.js"); // Hàm gửi email, dùng trong tính năng quên mật khẩu
const crypto = require("crypto"); //Module tích hợp sẵn trong Node.js để xử lý các thao tác mã hóa

// Chức năng: Tạo JWT, đặt nó vào cookie, và trả về thông tin người dùng trong response.
const createSendToken = (user, statusCode, req, res) => {
  // Tạo token JWT chứa user.id
  const id = user._id;
  const token = jwt.sign({ id }, process.env.JWT_KEY, { 
    expiresIn: process.env.EXPIRES,
  });
  //Lưu token trong cookie với thời gian sống là 30 ngày
  res.cookie("jwt", token, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });

  // Xóa mật khẩu (user.password = undefined) khỏi kết quả trả về.
  // Remove password from output
  user.password = undefined;

  //Trả về phản hồi JSON chứa thông tin người dùng và token.
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

// Chức năng: Xử lý đăng nhập người dùng.
exports.login = catchAsync(async (req, res, next) => {
  //Nhận id và password từ yêu cầu.
  const { id, password } = req.body;
  // Tìm người dùng trong cơ sở dữ liệu bằng id
  const user = await userModels.findOne({ id });
  //check user and password
  // Kiểm tra mật khẩu:
  if (!user || !(await user.checkPassword(password)))
    // Nếu không khớp hoặc người dùng không tồn tại, trả về lỗi.
    return next(new error("kiểm tra lại tài khoản hoặc mật khẩu", 201));

  //gửi res, token cho user
  // Nếu đúng, gọi createSendToken để trả về JWT và thông tin người dùng
  createSendToken(user, 200, req, res);
});
// Chức năng: Tạo người dùng mới.
exports.createUser = catchAsync(async (req, res, next) => { //Nhận dữ liệu từ yêu cầu.
  const user = await userModels.create(req.body); //Tạo người dùng mới trong MongoDB bằng userModels.create()
  user.password = undefined; //Xóa mật khẩu khỏi phản hồi.
  // Trả về phản hồi JSON chứa thông tin người dùng mới. 
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
// Chức năng: Đăng xuất người dùng.
exports.logout = (req, res) => {
  //Ghi đè cookie jwt với giá trị "loggedout" và thời gian sống ngắn (10 giây).
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  //Đánh dấu token hiện tại là hết hạn trong cơ sở dữ liệu.
  req.user.jwtExpires = Date.now() - 1000;
  req.user.save();
  //Trả về phản hồi thành công.
  res.status(200).json({ status: "success" });
};
// Chức năng: Middleware bảo vệ các route chỉ cho phép người dùng đã đăng nhập truy cập.
exports.authMiddleware = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  // 1) Lấy token từ header hoặc cookie.
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

  // 2) Verification token
  // 2) Xác minh token bằng jwt.verify().
  const decoded = jwt.verify(token, process.env.JWT_KEY);

  // 3) Check user
  // 3) Tìm người dùng dựa trên decoded.id từ token.
  const currentUser = await userModels.findById(decoded.id);
  // Kiểm tra người dùng: 
  if (!currentUser) {
    return next(
      // Nếu không tồn tại hoặc token đã hết hạn, trả về lỗi.
      new error("The user belonging to this token does no longer exist.", 401)
    );
  }

  // 4) Check if tokenExpires
  if (currentUser.checkjwtExpires(decoded.iat)) {
    return next(new error(" Please log in again.", 401));
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  // Gắn thông tin người dùng (req.user) vào request để các middleware tiếp theo có thể sử dụng.
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});
// Chức năng: Middleware giới hạn quyền truy cập dựa trên vai trò của người dùng.
exports.restrictTo = (...roles) => {
  // Nhận danh sách các vai trò được phép truy cập.
  return (req, res, next) => {
    // Kiểm tra vai trò của người dùng hiện tại (req.user.role)
    if (!roles.includes(req.user.role)) {
      // Nếu không khớp, trả về lỗi.
      return next(new error("Bạn không có quyền thực hiện hành động này", 403));
    }

    next();
  };
};
// Chức năng: Cho phép người dùng đã đăng nhập thay đổi mật khẩu.
exports.updatePassword = catchAsync(async (req, res, next) => {
  const { password, newPassword } = req.body; //Nhận password và newPassword từ yêu cầu.
  // Kiểm tra mật khẩu hiện tại của người dùng.
  if (!password || !newPassword)
    return next(new error("Vui lòng nhập password hoặc newPassword", 201));
  const user = await userModels.findById(req.user._id); 
  //check user and password
  if (!user || !(await user.checkPassword(password)))
    return next(new error("password không đúng", 201));
  //Nếu đúng, cập nhật mật khẩu mới và lưu lại trong cơ sở dữ liệu.
  user.password = newPassword;
  await user.save();
  //gửi res, token cho user
  // Trả về token mới cho người dùng qua createSendToken.
  createSendToken(user, 200, req, res);
});
// Chức năng: Tạo và gửi mã token để đặt lại mật khẩu qua email.
exports.forgotPassword = catchAsync(async (req, res, next) => {
  //Nhận id từ yêu cầu và tìm người dùng
  const { id } = req.body;  
  const user = await userModels.findOne({ id });
  if (!user) return next(new error("Không tìm thấy tài khoản", 201));
  //Tạo token đặt lại mật khẩu và lưu token đó trong cơ sở dữ liệu với thời hạn 10 phút.
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Gửi email chứa đường link đặt lại mật khẩu đến email của người dùng.
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
    // Nếu thành công thì trả về thành công
    res.status(200).json({
      status: "success",
      message: "check email for reset password",
    });
  }
  // Nếu lỗi xảy ra khi gửi email, xóa token khỏi cơ sở dữ liệu và trả về lỗi. 
  catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new error("There was an error sending the email. Try again later!", 500)
    );
  }
});
// Chức năng: Đặt lại mật khẩu khi người dùng có mã token hợp lệ.
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  // Tạo token băm (hashedToken) từ mã token nhận được.
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  // Tìm người dùng dựa trên token băm và kiểm tra thời hạn.
  const user = await userModels.findOne({
    resetToken: hashedToken,
    resetTokenExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  // Nếu token hợp lệ, cập nhật mật khẩu mới và xóa token khỏi cơ sở dữ liệu.
  if (!user) {
    return next(new error("Token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  // Trả về JWT mới qua createSendToken.
  createSendToken(user, 200, req, res);
});
