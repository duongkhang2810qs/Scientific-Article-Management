const messageModel = require("../../models/message.model");
const factory = require("./factory");
const catchAsync = require("../../utils/catchAsync");
exports.addSender = catchAsync(async (req, res, next) => {
  req.body.sender = req.user._id;
  next();
});
exports.addUserIdToQuery = catchAsync(async (req, res, next) => {
  req.query.sender = req.user._id.toString();
  next();
});

exports.getMessages = factory.getAll(messageModel);
exports.postMessage = factory.createOne(messageModel);
exports.updateMessage = factory.updateOne(messageModel, true);
exports.deleteMessage = catchAsync(async (req, res, next) => {
  const data = await messageModel.findOneAndDelete({
    _id: req.params.id,
    sender: req.user._id,
  });
  if (!data) return next(new error("No document found with that ID", 404));

  res.status(200).json({
    status: "success",
    data: null,
    deleteCount: deleteMessage.deletedCount,
  });
});
