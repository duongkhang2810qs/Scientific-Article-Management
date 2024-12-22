// Wrapper để xử lý các hàm bất đồng bộ, giúp tự động bắt lỗi và chuyển chúng đến middleware xử lý lỗi.
const catchAsync = require("../../utils/catchAsync");
// Một lớp lỗi tùy chỉnh để trả về các thông báo lỗi có cấu trúc.
const error = require("../../utils/error");
// Model MongoDB tương ứng với tài liệu council trong cơ sở dữ liệu.
const councilModel = require("../../models/council.model");
// Module chứa các hàm tái sử dụng (factory functions) cho các thao tác CRUD. Các hàm trong factory có thể áp dụng cho nhiều model khác nhau.
const factory = require("./factory");

exports.getcouncils = factory.getAll(councilModel); 
exports.getcouncil = factory.getOne(councilModel);
exports.postcouncil = factory.createOne(councilModel);
exports.updatecouncil = factory.updateOne(councilModel);
exports.deletecouncil = factory.deleteOne(councilModel);
