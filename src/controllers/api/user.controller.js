// Import các module cần thiết
const UserModels = require("../../models/user.model"); // Model tương tác với bảng Users trong cơ sở dữ liệu
const error = require("../../utils/error.js"); // Module tiện ích để tạo lỗi tùy chỉnh
const catchAsync = require("../../utils/catchAsync.js"); // Hàm tiện ích để xử lý lỗi bất đồng bộ (async/await)
const filterObj = require("../../utils/filterObj.js"); // Hàm tiện ích để lọc các trường được phép trong req.body
const Features = require("../../utils/Features.js"); // Module quản lý các tính năng lọc, sắp xếp, phân trang, v.v.
const multer = require("multer"); // Thư viện xử lý upload file
const factory = require("./factory"); // Module tái sử dụng các logic CRUD

// Cấu hình lưu trữ tệp với multer
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/public/img/users"); // Thư mục lưu trữ file ảnh
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1]; // Lấy phần mở rộng của file (jpg, png, v.v.)
    req.body.avatar = `${req.user.id}-${Date.now()}.${ext}`; // Đặt tên file theo format userID-timestamp.ext
    cb(null, `${req.user.id}-${Date.now()}.${ext}`); // Lưu tên file
  },
});

// Bộ lọc kiểm tra tệp upload có phải là ảnh hay không
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true); // Nếu là ảnh, cho phép upload
  } else {
    cb(new error("Not an image! Please upload only images.", 400), false); // Nếu không phải ảnh, trả về lỗi
  }
};

// Cấu hình upload file với multer
const upload = multer({
  storage: multerStorage, // Lưu trữ file theo cấu hình multerStorage
  fileFilter: multerFilter, // Áp dụng bộ lọc file
});

// Middleware upload ảnh đại diện
exports.uploadUserPhoto = upload.single("avatar"); // Chỉ cho phép upload 1 file với trường tên "avatar"

// Import các phương thức CRUD từ factory
const { getAll, getOne, updateOne } = require("./factory.js");

// Middleware lấy thông tin user hiện tại
exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user._id; // Gắn userID hiện tại vào req.params.id
  next(); // Tiếp tục middleware tiếp theo
});

// Middleware cập nhật thông tin user hiện tại
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password) {
    // Không cho phép cập nhật mật khẩu qua route này
    return next(
      new error(
        "If you want to change your password, please use /updatePassword",
        400
      )
    );
  }

  // Lọc các trường được phép cập nhật (name, email)
  req.body = filterObj(req.body, "name", "email");

  // Gắn userID hiện tại vào req.params.id
  req.params.id = req.user._id;

  // Nếu có file ảnh, thêm avatar vào req.body
  if (req.file) req.body.avatar = req.file.filename;

  next(); // Tiếp tục middleware tiếp theo
});

// Middleware đánh dấu user là "block" (xóa mềm)
exports.deleteMe = catchAsync(async (req, res, next) => {
  const users = await UserModels.findByIdAndUpdate(req.user.id, {
    status: "block", // Đánh dấu trạng thái user là "block"
  });

  // Trả về phản hồi thành công
  res.status(200).json({
    status: "success!!!",
    message: "delete user", // Thông báo user đã bị xóa
    data: null, // Không trả về dữ liệu nào
  });
});

// Lấy danh sách tất cả người dùng (GET /users)
exports.getUsers = getAll(UserModels);

// Lấy thông tin một người dùng cụ thể (GET /users/:id)
exports.getUser = getOne(UserModels);

// Cập nhật thông tin một người dùng (PATCH /users/:id)
exports.updateUser = updateOne(UserModels);

// Xóa một người dùng (DELETE /users/:id)
exports.deleteUser = factory.deleteOne(UserModels);
