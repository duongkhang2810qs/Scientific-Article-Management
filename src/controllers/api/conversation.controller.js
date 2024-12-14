const catchAsync = require("../../utils/catchAsync");
const error = require("../../utils/error");
const conversationModel = require("../../models/conversation.model");
const messageModel = require("../../models/message.model");
const factory = require("./factory");

exports.conversationExists = catchAsync(async (req, res, next) => {
  console.log(req.body);
  if (req.body.isGroup === true) {
    req.body.admin = req.user._id;
    req.body.participants = req.body.participants.concat(req.user._id);

    return next();
  }
  const data = await conversationModel.findOne({
    isGroup: false,
    participants: { $all: [req.user._id, req.body.recipient] },
  });
  if (!data) {
    req.body.name = "conversation name";
    req.body.participants = [req.user._id, req.body.recipient];
    req.body.isGroup = false;
    console.log(req.body);
    return next();
  }
  res.status(200).json({
    status: "success",
    data,
  });
});
exports.getConversations = factory.getAll(conversationModel);
exports.getConversation = factory.getOne(conversationModel, true);
exports.postConversation = factory.createOne(conversationModel);
exports.updateConversation = factory.updateOne(conversationModel, true);
exports.deleteConversation = catchAsync(async (req, res, next) => {
  const data = await conversationModel.findOneAndDelete({
    _id: req.params.id,
    admin: req.user._id,
    isGroup: true,
  });
  if (!data) return next(new error("No document found with that ID", 404));
  const deleteMessage = await messageModel.deleteMany({
    conversation: req.params.id,
  });
  res.status(200).json({
    status: "success",
    data: null,
    deleteCount: deleteMessage.deletedCount,
  });
});
