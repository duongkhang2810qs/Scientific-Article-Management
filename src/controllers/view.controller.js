// Import các module cần thiết
const catchAsync = require("../utils/catchAsync"); // Hàm tiện ích xử lý lỗi bất đồng bộ
const error = require("../utils/error"); // Module tiện ích để tạo lỗi tùy chỉnh
const topicModel = require("../models/topic.model"); // Model Mongoose cho collection Topic
const notifyModel = require("../models/notify.model"); // Model Mongoose cho collection Notify
const councilModel = require("../models/council.model"); // Model Mongoose cho collection Council
const factory = require("./factory"); // Module tái sử dụng các phương thức CRUD
const filterObj = require("../utils/filterObj"); // Hàm tiện ích để lọc các trường trong req.body
const UserModels = require("../models/user.model"); // Model Mongoose cho collection Users
const conversationModel = require("../models/conversation.model"); // Model Mongoose cho collection Conversation

// Trang chủ hiển thị thông báo
exports.home = factory.getAll(notifyModel, "home");

// Hiển thị danh sách đề tài
exports.getTopics = factory.getAll(topicModel, "project_list");

// Hiển thị chi tiết một thông báo
exports.viewNotify = factory.getOne(notifyModel, "view_notify");

// Hiển thị chi tiết một hội đồng
exports.viewCouncil = factory.getOne(councilModel, "view_council");

// Middleware lọc quyền truy cập dựa trên vai trò người dùng
exports.filterByRole = catchAsync(async (req, res, next) => {
  if (req.user.role == "admin") {
    // Nếu là admin, chỉ cho phép cập nhật các trường "GiangVien", "HoiDong"
    req.body = filterObj(req.body, "GiangVien", "HoiDong");
    next();
  }

  if (req.user.role == "sinh_vien" && req.user.DeTai.includes(req.params.id)) {
    // Nếu là sinh viên và thuộc đề tài, chỉ cho phép cập nhật các trường liên quan
    req.body = filterObj(
      req.body,
      "ThanhVien",
      "TenDeTai",
      "GhiChu",
      "MaNganh",
      "NgayThucHien",
      "NgayKetThuc",
      "KinhPhi"
    );
    next();
  }
  if (req.user.role == "giao_vien" && req.user.DeTai.includes(req.params.id)) {
    // Nếu là giảng viên và thuộc đề tài, chỉ cho phép cập nhật các trường liên quan
    req.body = filterObj(req.body, "Diem", "NhanXet");
    next();
  }

  return next(new error("Bạn không có quyền thực hiện hành động này", 403)); // Nếu không đủ quyền, trả lỗi
});

// Middleware để lấy thông tin user hiện tại
exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user._id; // Gắn userID hiện tại vào req.params.id
  res.locals.me = true; // Đánh dấu user đang là người xem thông tin chính mình
  next();
});

// Hiển thị chi tiết một người dùng
exports.getUser = factory.getOne(UserModels, "view_user");

// Hiển thị chi tiết một đề tài
exports.getTopic = catchAsync(async (req, res, next) => {
  const data = await topicModel
    .findById(req.params.id)
    .populate("ThanhVien") // Lấy thêm thông tin thành viên
    .populate("GiangVien"); // Lấy thêm thông tin giảng viên

  if (!data) return next(new error("No document found with that ID", 404)); // Nếu không tìm thấy, trả lỗi

  res.status(200).render("view_topic", { data, user: req.user }); // Trả về giao diện cùng dữ liệu
});

// Hiển thị đánh giá tổng quan về các đề tài
exports.getRating = catchAsync(async (req, res, next) => {
  const totalTopics = await topicModel.countDocuments(); // Tổng số đề tài
  const completedTopics = await topicModel.countDocuments({
    TrangThai: "hoàn thành",
    TrangThai: "Hoàn thành",
  }); // Số đề tài hoàn thành
  const cancelledTopics = await topicModel.countDocuments({ TrangThai: "hủy" }); // Số đề tài bị hủy
  const overdueTopics = await topicModel.countDocuments({
    NgayKetThuc: { $lt: new Date() }, // Số đề tài quá hạn
  });
  const ongoingTopics =
    totalTopics - completedTopics - cancelledTopics - overdueTopics; // Số đề tài đang thực hiện
  const topTopics = await topicModel.find().sort({ Diem: -1 }).limit(10); // Top 10 đề tài có điểm cao nhất

  // Tính phần trăm từng trạng thái
  const completedPercentage = ((completedTopics / totalTopics) * 100).toFixed(
    2
  );
  const cancelledPercentage = ((cancelledTopics / totalTopics) * 100).toFixed(
    2
  );
  const ongoingPercentage = ((ongoingTopics / totalTopics) * 100).toFixed(2);
  const overduePercentage = ((overdueTopics / totalTopics) * 100).toFixed(2);

  res.status(200).render("rating", {
    totalTopics,
    completedTopics,
    cancelledTopics,
    ongoingTopics,
    overdueTopics,
    topTopics,
    cancelledPercentage,
    completedPercentage,
    ongoingPercentage,
    overduePercentage,
  }); // Trả về giao diện với các thông tin thống kê
});

// Hiển thị danh sách các cuộc trò chuyện
exports.getConversations = factory.getAll(conversationModel, "chat");
