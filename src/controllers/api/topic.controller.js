const catchAsync = require("../../utils/catchAsync");
const error = require("../../utils/error");
const topicModel = require("../../models/topic.model");
const factory = require("./factory");
const filterObj = require("../../utils/filterObj");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/public/files");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    req.body.file = `${req.params.id}-${Date.now()}.${ext}`;
    cb(null, `${req.params.id}-${Date.now()}.${ext}`);
  },
});

const upload = multer({ storage: storage });

exports.uploadFiles = upload.array("files", 10);

exports.getTopics = factory.getAll(topicModel);
exports.getTopic = factory.getOne(topicModel);
exports.postTopic = factory.createOne(topicModel);
exports.updateTopic = factory.updateOne(topicModel);
exports.filterByRole = catchAsync(async (req, res, next) => {
  if (req.user.role == "admin") {
    req.body = filterObj(req.body, "GiangVien", "HoiDong", "TrangThai");
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
