// Import các module cần thiết
const error = require("../utils/error"); // Module để tạo lỗi tùy chỉnh
const catchAsync = require("../utils/catchAsync"); // Hàm tiện ích để xử lý lỗi bất đồng bộ (async/await)
const Features = require("../utils/Features"); // Module quản lý các tính năng lọc, sắp xếp, chọn trường, và phân trang

// Hàm tạo một tài liệu mới
exports.createOne = (model, view) => {
  return catchAsync(async (req, res, next) => {
    const data = await model.create(req.body); // Tạo một tài liệu mới từ dữ liệu trong req.body

    if (!data) return next(new error("No document found with that ID", 404)); // Nếu không tạo được, trả về lỗi

    res.status(200).render(view, { data }); // Trả về dữ liệu và render giao diện được chỉ định
  });
};

// Hàm xóa một tài liệu
exports.deleteOne = (model, view) => {
  return catchAsync(async (req, res, next) => {
    const data = await model.findByIdAndDelete(req.params.id); // Tìm và xóa tài liệu theo id

    if (!data) return next(new error("No document found with that ID", 404)); // Nếu không tìm thấy tài liệu, trả về lỗi

    res.status(200).render(view, { data }); // Trả về dữ liệu và render giao diện được chỉ định
  });
};

// Hàm cập nhật một tài liệu
exports.updateOne = (model, view) => {
  return catchAsync(async (req, res, next) => {
    const data = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Trả về tài liệu đã cập nhật
      runValidator: true, // Kiểm tra tính hợp lệ của dữ liệu trước khi cập nhật
    });

    if (!data) return next(new error("No document found with that ID", 404)); // Nếu không tìm thấy tài liệu, trả về lỗi

    res.status(200).render(view, { data }); // Trả về dữ liệu và render giao diện được chỉ định
  });
};

// Hàm lấy một tài liệu cụ thể
exports.getOne = (model, view) => {
  return catchAsync(async (req, res, next) => {
    const data = await model.findById(req.params.id); // Tìm tài liệu theo id

    if (!data) return next(new error("No document found with that ID", 404)); // Nếu không tìm thấy tài liệu, trả về lỗi

    res.status(200).render(view, { data, user: req.user }); // Trả về dữ liệu và render giao diện được chỉ định
  });
};

// Hàm lấy tất cả các tài liệu
exports.getAll = (model, view) => {
  return catchAsync(async (req, res, next) => {
    const features = new Features(model, req.query) // Sử dụng module Features để xử lý query string
      .filter() // Lọc dữ liệu theo điều kiện
      .sort() // Sắp xếp kết quả
      .fields() // Chọn các trường cần trả về
      .page(); // Phân trang kết quả

    const data = await features.query; // Thực thi query để lấy dữ liệu

    if (!data) return next(new error("No document found with that ID", 404)); // Nếu không có dữ liệu, trả về lỗi

    res.status(200).render(view, { data }); // Trả về dữ liệu và render giao diện được chỉ định
  });
};
