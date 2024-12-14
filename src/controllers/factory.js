const error = require("../utils/error");
const catchAsync = require("../utils/catchAsync");
const Features = require("../utils/Features");

exports.createOne = (model, view) => {
  return catchAsync(async (req, res, next) => {
    const data = await model.create(req.body);
    if (!data) return next(new error("No document found with that ID", 404));
    res.status(200).render(view, { data });
  });
};
exports.deleteOne = (model, view) => {
  return catchAsync(async (req, res, next) => {
    const data = await model.findByIdAndDelete(req.params.id);
    if (!data) return next(new error("No document found with that ID", 404));
    res.status(200).render(view, { data });
  });
};

exports.updateOne = (model, view) => {
  return catchAsync(async (req, res, next) => {
    const data = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidator: true,
    });
    if (!data) return next(new error("No document found with that ID", 404));
    res.status(200).render(view, { data });
  });
};

exports.getOne = (model, view) => {
  return catchAsync(async (req, res, next) => {
    const data = await model.findById(req.params.id);
    if (!data) return next(new error("No document found with that ID", 404));
    res.status(200).render(view, { data, user: req.user });
  });
};
exports.getAll = (model, view) => {
  return catchAsync(async (req, res, next) => {
    const features = new Features(model, req.query)
      .filter()
      .sort()
      .fields()
      .page();
    const data = await features.query;
    if (!data) return next(new error("No document found with that ID", 404));
    res.status(200).render(view, { data });
  });
};
