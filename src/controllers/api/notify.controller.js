const catchAsync = require("../../utils/catchAsync");
const error = require("../../utils/error");
const notifyModel = require("../../models/notify.model");
const factory = require("./factory");

exports.getNotifys = factory.getAll(notifyModel);
exports.getNotify = factory.getOne(notifyModel);
exports.postNotify = factory.createOne(notifyModel);
exports.updateNotify = factory.updateOne(notifyModel);
exports.deleteNotify = factory.deleteOne(notifyModel);
