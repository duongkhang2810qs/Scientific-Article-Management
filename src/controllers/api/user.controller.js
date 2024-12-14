const UserModels = require("../../models/user.model");
const error = require("../../utils/error.js");
const catchAsync = require("../../utils/catchAsync.js");
const filterObj = require("../../utils/filterObj.js");
const Features = require("../../utils/Features.js");
const multer = require("multer");
const factory = require("./factory");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/public/img/users");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    req.body.avatar = `${req.user.id}-${Date.now()}.${ext}`;
    cb(null, `${req.user.id}-${Date.now()}.${ext}`);
  },
}); // lưu ảnh vào thư mục public/img/users

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else cb(new error("Not an image! Please upload only images.", 400), false);
}; // kiểm tra file có phải là ảnh hay không

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
}); // upload file

exports.uploadUserPhoto = upload.single("avatar"); // upload ảnh đại diện
const { getAll, getOne, updateOne } = require("./factory.js");
exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user._id;

  next();
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password) {
    return next(
      new error(
        "if you want to change my password, please use /updatePassword",
        400
      )
    );
  }
  req.body = filterObj(req.body, "name", "email");
  req.params.id = req.user._id;
  if (req.file) req.body.avatar = req.file.filename;

  next();
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  const users = await UserModels.findByIdAndUpdate(req.user.id, {
    status: "block",
  });
  res.status(200).json({
    status: "success!!!",
    message: "delete user",
    data: null,
  });
});
exports.getUsers = getAll(UserModels);
exports.getUser = getOne(UserModels);
exports.updateUser = updateOne(UserModels);
exports.deleteUser = factory.deleteOne(UserModels);
