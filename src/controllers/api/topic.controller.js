const catchAsync = require("../../utils/catchAsync");
const error = require("../../utils/error");
const topicModel = require("../../models/topic.model");
const factory = require("./factory");
const filterObj = require("../../utils/filterObj");
const multer = require("multer"); // Thư viện quản lý tải lên tệp (upload files),

// cấu hình lưu trữ tệp
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/public/files"); // Định nghĩa thư mục lưu trữ tệp (./src/public/files).
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1]; // Lấy phần mở rộng của tệp từ mimetype (ví dụ: pdf, jpg).
    req.body.file = `${req.params.id}-${Date.now()}.${ext}`;
    cb(null, `${req.params.id}-${Date.now()}.${ext}`); //ID của đề tài 
  },
});

const upload = multer({ storage: storage });

exports.uploadFiles = upload.array("files", 10); // Hỗ trợ tải lên tối đa 10 tệp trong một lần gọi API.

exports.getTopics = factory.getAll(topicModel);
exports.getTopic = factory.getOne(topicModel);
exports.postTopic = factory.createOne(topicModel);
exports.updateTopic = factory.updateOne(topicModel);
exports.filterByRole = catchAsync(async (req, res, next) => {
   // Lọc dữ liệu trong req.body dựa trên vai trò (role) của người dùng.
  if (req.user.role == "admin") {
    req.body = filterObj(req.body, "GiangVien", "HoiDong", "TrangThai"); // Chỉ cho phép cập nhật các trường "GiangVien", "HoiDong", "TrangThai"
    next();
  } else if (req.user.role == "sinh_vien") {
    req.body = filterObj(
      req.body,
      "ThanhVien",
      "TenDeTai",
      "GhiChu",
      "MaNganh",
      "NgayThucHien",
      "NgayKetThuc",
      "KinhPhi",
      "TrangThai"
    );
    next();
  } else if (req.user.role == "giang_vien") {
    req.body = filterObj(req.body, "Diem", "NhanXet", "TrangThai");
    next();
  } else {
    return next(new error("Bạn không có quyền thực hiện hành động này", 403));
  }
});

exports.deleteTopic = factory.deleteOne(topicModel);
