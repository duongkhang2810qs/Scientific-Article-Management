const catchAsync = require("../../utils/catchAsync");
const error = require("../../utils/error");
const councilModel = require("../../models/council.model"); // Model tương tác với cơ sở dữ liệu, định nghĩa các thao tác với collection hội đồng
const factory = require("./factory"); //  Module chứa các phương thức chung cho CRUD, tái sử dụng cho nhiều controller khác.

// lấy danh sách 
exports.getcouncils = factory.getAll(councilModel);
exports.getcouncil = factory.getOne(councilModel); // lấy thông tin chi tiết của 1 council cụ thể
exports.postcouncil = factory.createOne(councilModel); // tạo mới 1 council 
exports.updatecouncil = factory.updateOne(councilModel); // cập nhật thông tin của 1 council 
exports.deletecouncil = factory.deleteOne(councilModel); // xóa khỏi database 
