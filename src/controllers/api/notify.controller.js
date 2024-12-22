// Wrapper để xử lý các hàm bất đồng bộ, giúp tự động bắt lỗi và chuyển chúng đến middleware xử lý lỗi.
const catchAsync = require("../../utils/catchAsync");
// Một lớp lỗi tùy chỉnh để trả về các thông báo lỗi có cấu trúc.
const error = require("../../utils/error");
// Model MongoDB tương ứng với tài liệu thông báo trong cơ sở dữ liệu.
const notifyModel = require("../../models/notify.model");
// Module chứa các hàm tái sử dụng (factory functions) cho các thao tác CRUD. Các hàm trong factory có thể áp dụng cho nhiều model khác nhau.
const factory = require("./factory");

exports.getNotifys = factory.getAll(notifyModel);
exports.getNotify = factory.getOne(notifyModel);
exports.postNotify = factory.createOne(notifyModel);
exports.updateNotify = factory.updateOne(notifyModel);
exports.deleteNotify = factory.deleteOne(notifyModel);
