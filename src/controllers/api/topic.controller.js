// Wrapper để xử lý các hàm bất đồng bộ, giúp tự động bắt lỗi và chuyển chúng đến middleware xử lý lỗi.
const catchAsync = require("../../utils/catchAsync"); 
// Một lớp lỗi tùy chỉnh để trả về các thông báo lỗi có cấu trúc.
const error = require("../../utils/error"); 
//Là model MongoDB cho tài liệu Topic (chủ đề). Dùng để thực hiện các thao tác CRUD (Create, Read, Update, Delete) trên tài liệu này.
const topicModel = require("../../models/topic.model"); 
//Là model MongoDB cho tài liệu Topic (chủ đề). Dùng để thực hiện các thao tác CRUD (Create, Read, Update, Delete) trên tài liệu này.
const factory = require("./factory"); 
//Một utility dùng để lọc các trường hợp hợp lệ trong req.body, chỉ giữ lại các trường được phép.
const filterObj = require("../../utils/filterObj");
// Một middleware xử lý file upload, giúp quản lý việc tải lên và lưu file vào máy chủ.
const multer = require("multer");

// Cấu hình lưu file với multer
const storage = multer.diskStorage({ //Định nghĩa cách thức lưu trữ file khi tải lên.
  //Chỉ định thư mục lưu file. Ở đây, tất cả file sẽ được lưu trong ./src/public/files
  destination: function (req, file, cb) {
    cb(null, "./src/public/files"); 
  },
  // Tạo tên file độc nhất dựa trên:
// req.params.id: ID từ URL.
// Date.now(): Timestamp hiện tại.
// ext: Phần mở rộng của file (ví dụ: png, jpg).
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    req.body.file = `${req.params.id}-${Date.now()}.${ext}`;
    cb(null, `${req.params.id}-${Date.now()}.${ext}`);
  },
});
// Middleware tải file
// Sử dụng cấu hình storage đã định nghĩa để xử lý việc lưu trữ file.
const upload = multer({ storage: storage }); 
// Middleware cho phép tải lên tối đa 10 file với trường input là "files".
exports.uploadFiles = upload.array("files", 10);
// Lấy danh sách tất cả topics
exports.getTopics = factory.getAll(topicModel); //Dùng hàm getAll từ factory để tránh viết lại logic.
// Lấy một topic cụ thể
exports.getTopic = factory.getOne(topicModel); //Sử dụng hàm getOne từ factory.
//Tạo topic mới trong model topicModel
exports.postTopic = factory.createOne(topicModel); //Dùng hàm createOne từ factory
// Cập nhật topic trong topicModel
exports.updateTopic = factory.updateOne(topicModel); //Sử dụng hàm updateOne từ factory.

// Dựa trên vai trò người dùng (req.user.role), giới hạn các trường được phép gửi trong req.body.
exports.filterByRole = catchAsync(async (req, res, next) => {
  // Nếu là vai trò admin thì chỉ được chỉnh sửa các trường: "GiangVien", "HoiDong", "TrangThai"
  if (req.user.role == "admin") {
    req.body = filterObj(req.body, "GiangVien", "HoiDong", "TrangThai");
    next();
  } 
  // Nếu vai trò là sinh viên thì Chỉ được chỉnh sửa các trường liên quan đến đề tài: "ThanhVien", "TenDeTai", "KinhPhi", v.v.
  else if (req.user.role == "sinh_vien") {
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
  } 
  // Nếu vai trò là giảng viên thì Chỉ được chỉnh sửa các trường: "Diem", "NhanXet", "TrangThai"
  else if (req.user.role == "giang_vien") {
    req.body = filterObj(req.body, "Diem", "NhanXet", "TrangThai");
    next();
  } 
  // Nếu vai trò không hợp lệ thì: Trả về lỗi 403 (Forbidden) với thông báo: "Bạn không có quyền thực hiện hành động này".
  else {
    return next(new error("Bạn không có quyền thực hiện hành động này", 403));
  }
});
// Xóa topic dựa trên ID từ topicModel
exports.deleteTopic = factory.deleteOne(topicModel);
