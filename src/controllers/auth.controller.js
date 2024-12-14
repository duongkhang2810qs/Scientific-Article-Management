const userModels = require("../models/user.model.js");
const catchAsync = require("../utils/catchAsync.js");
const jwt = require("jsonwebtoken");
const error = require("../utils/error.js");
const sendEmail = require("../utils/email.js");
const crypto = require("crypto");

exports.authMiddleware = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
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
    return next();
  }

  // 2) Verification token
  //const decoded = await promisify(jwt.verify)(token, process.env.JWT_KEY);
  const decoded = jwt.verify(token, process.env.JWT_KEY);

  // 3) Check user
  const currentUser = await userModels.findById(decoded.id);
  if (!currentUser) {
    return next();
  }

  // 4) Check if tokenExpires
  if (currentUser.checkjwtExpires(decoded.iat)) {
    return next();
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new error("Bạn không có quyền thực hiện hành động này", 403));
    }

    next();
  };
};
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { id } = req.body;
  const user = await userModels.findOne({ id });
  if (!user) return next(new error("Không tìm thấy tài khoản", 201));

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/resetPassword/${resetToken}`;
  const message = `Đặt lại mật khẩu của bạn bằng cách nhấp vào đường link này: ${resetURL}\nLink có hiệu lực trong 10 phút.\nNếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Đặt lại mật khẩu",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Kiểm tra email để đổi mật khẩu",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new error(
        "Không thành công, nếu bạn chưa cập nhật email vui lòng liên hệ Admin để xử lí",
        500
      )
    );
  }
});
