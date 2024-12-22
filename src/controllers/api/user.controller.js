// Model MongoDB đại diện cho tài liệu User, chứa các thông tin liên quan đến người dùng.
const UserModels = require("../../models/user.model");
// Một lớp lỗi tùy chỉnh để trả về các thông báo lỗi có cấu trúc.
const error = require("../../utils/error.js");
// Wrapper để xử lý các hàm bất đồng bộ, giúp tự động bắt lỗi và chuyển chúng đến middleware xử lý lỗi.
const catchAsync = require("../../utils/catchAsync.js");
// Hàm lọc chỉ giữ lại các trường hợp lệ trong req.body trước khi cập nhật dữ liệu.
const filterObj = require("../../utils/filterObj.js");
// Một utility (chưa được sử dụng trong đoạn code này) thường giúp xử lý các tính năng như phân trang, lọc, sắp xếp dữ liệu trong MongoDB.
const Features = require("../../utils/Features.js");
// Middleware để xử lý file upload trong ứng dụng Node.js.
const multer = require("multer");
// Tập hợp các hàm CRUD (Create, Read, Update, Delete) được tái sử dụng cho nhiều model.
const factory = require("./factory");
// Cấu hình nơi lưu file và cách đặt tên file khi người dùng tải ảnh lên.
const multerStorage = multer.diskStorage({
  // Quy định thư mục lưu file, ở đây là ./src/public/img/users
  destination: (req, file, cb) => {
    cb(null, "./src/public/img/users");
  },
  // Tạo tên file độc nhất dựa trên:
  // req.user.id: ID của người dùng.
  // Date.now(): Thời điểm hiện tại (timestamp).
  // file.mimetype.split("/")[1]: Phần mở rộng của file (ví dụ: png, jpg)
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    req.body.avatar = `${req.user.id}-${Date.now()}.${ext}`;
    cb(null, `${req.user.id}-${Date.now()}.${ext}`);
  },
}); // lưu ảnh vào thư mục public/img/users

// Bộ lọc file: Chỉ cho phép người dùng tải lên file ảnh. Nếu file không phải là ảnh, trả về lỗi.
const multerFilter = (req, file, cb) => {
  // Kiểm tra loại file có phải là ảnh không 
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } 
  // Nếu không phải ảnh, trả về lỗi với thông báo: "Not an image! Please upload only images."
  else cb(new error("Not an image! Please upload only images.", 400), false);
}; // kiểm tra file có phải là ảnh hay không

// Kết hợp cấu hình lưu trữ (multerStorage) và bộ lọc file (multerFilter) để xử lý file tải lên.
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
}); // upload file

// //Cho phép tải lên một file duy nhất với trường input có name là "avatar"
exports.uploadUserPhoto = upload.single("avatar"); 

const { getAll, getOne, updateOne } = require("./factory.js");
//Middleware getMe: Dùng ID này để lấy thông tin chi tiết của người dùng trong các middleware tiếp theo.
exports.getMe = catchAsync(async (req, res, next) => {
  // Gắn ID của người dùng hiện tại (req.user._id) vào req.params.id.
  req.params.id = req.user._id; 

  next();
});
//  Middleware updateMe: Xử lý yêu cầu cập nhật thông tin cá nhân của người dùng.
exports.updateMe = catchAsync(async (req, res, next) => {
  // người dùng cố gắng thay đổi mật khẩu qua route này, trả về lỗi với thông báo:
  if (req.body.password) {
    return next(
      new error(
        "if you want to change my password, please use /updatePassword",
        400
      )
    );
  }
  // Chỉ cho phép cập nhật các trường: "name", "email".
  // Các trường khác sẽ bị loại bỏ nhờ hàm filterObj.
  req.body = filterObj(req.body, "name", "email");
  req.params.id = req.user._id;
  // Nếu có file tải lên, thêm trường avatar vào req.body với tên file mới.
  if (req.file) req.body.avatar = req.file.filename;

  next();
});

// Middleware deleteMe: Đánh dấu tài khoản người dùng hiện tại là "block" (khóa) thay vì xóa hoàn toàn khỏi cơ sở dữ liệu.
exports.deleteMe = catchAsync(async (req, res, next) => {
  const users = await UserModels.findByIdAndUpdate(req.user.id, {
    // Cập nhật trạng thái của người dùng (status) thành "block".
    status: "block",
  });
  // rả về phản hồi với trạng thái "success!!!"
  res.status(200).json({
    status: "success!!!",
    message: "delete user",
    data: null,
  });
});

// Các hàm CRUD sử dụng hàm tái sử dụng từ factory để thao tác với model UserModels.
exports.getUsers = getAll(UserModels);
exports.getUser = getOne(UserModels);
exports.updateUser = updateOne(UserModels);
exports.deleteUser = factory.deleteOne(UserModels);
