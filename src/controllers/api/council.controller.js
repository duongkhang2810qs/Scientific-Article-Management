const catchAsync = require("../../utils/catchAsync");
const error = require("../../utils/error");
const councilModel = require("../../models/council.model");
const factory = require("./factory");

exports.getcouncils = factory.getAll(councilModel);
exports.getcouncil = factory.getOne(councilModel);
exports.postcouncil = factory.createOne(councilModel);
exports.updatecouncil = factory.updateOne(councilModel);
exports.deletecouncil = factory.deleteOne(councilModel);
