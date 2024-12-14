const catchAsync = require("../utils/catchAsync");
const error = require("../utils/error");
const topicModel = require("../models/topic.model");
const notifyModel = require("../models/notify.model");
const councilModel = require("../models/council.model");
const factory = require("./factory");
const filterObj = require("../utils/filterObj");
const UserModels = require("../models/user.model");
const conversationModel = require("../models/conversation.model");
exports.home = factory.getAll(notifyModel, "home");
exports.getTopics = factory.getAll(topicModel, "project_list");
// exports.postTopic = factory.createOne(topicModel);
// exports.updateTopic = factory.updateOne(topicModel);
exports.viewNotify = factory.getOne(notifyModel, "view_notify");
exports.viewCouncil = factory.getOne(councilModel, "view_council");
// exports.editNotify = factory.getOne(notifyModel, "notify");
exports.filterByRole = catchAsync(async (req, res, next) => {
  if (req.user.role == "admin") {
    req.body = filterObj(req.body, "GiangVien", "HoiDong");
    next();
  }

  if (req.user.role == "sinh_vien" && req.user.DeTai.includes(req.params.id)) {
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
    req.body = filterObj(req.body, "Diem", "NhanXet");
    next();
  }
  return next(new error("Bạn không có quyền thực hiện hành động này", 403));
});
exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user._id;
  res.locals.me = true;
  next();
});
exports.getUser = factory.getOne(UserModels, "view_user");

exports.getTopic = catchAsync(async (req, res, next) => {
  const data = await topicModel
    .findById(req.params.id)
    .populate("ThanhVien")
    .populate("GiangVien");
  if (!data) return next(new error("No document found with that ID", 404));
  res.status(200).render("view_topic", { data, user: req.user });
});
exports.getTopics = factory.getAll(topicModel, "topic_list");
// exports.deleteTopic = factory.deleteOne(topicModel);
exports.getRating = catchAsync(async (req, res, next) => {
  const totalTopics = await topicModel.countDocuments();
  const completedTopics = await topicModel.countDocuments({
    TrangThai: "hoàn thành",
    TrangThai: "Hoàn thành",
  });
  const cancelledTopics = await topicModel.countDocuments({ TrangThai: "hủy" });
  const overdueTopics = await topicModel.countDocuments({
    NgayKetThuc: { $lt: new Date() },
  });
  const ongoingTopics =
    totalTopics - completedTopics - cancelledTopics - overdueTopics;
  const topTopics = await topicModel.find().sort({ Diem: -1 }).limit(10);
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
  });
});
exports.getConversations = factory.getAll(conversationModel, "chat");
