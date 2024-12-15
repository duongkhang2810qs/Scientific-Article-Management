// cung cấp các hàm chung (generic) thực hiện CRUD (Create, Read, Update, Delete) cho bất kỳ mô hình (model) nào trong ứng dụng.

const error = require("../../utils/error");
const catchAsync = require("../../utils/catchAsync");
const Features = require("../../utils/Features");

// Tạo một tài liệu (document) mới trong cơ sở dữ liệu. bất kì loại data nào như: user, council conversation,..
exports.createOne = (model) => {
  return catchAsync(async (req, res, next) => {
    const data = await model.create(req.body); // nhận data từ req.body
    // create là phương thức của Mongoose để lưu vào database
    if (!data) return next(new error("No document found with that ID", 404));
    res.status(200).json({
      status: "success",
      data: data,
    });
  });
};
 
// Xóa một tài liệu khỏi cơ sở dữ liệu. Dùng để xóa các tài liệu dựa trên _id trong req.params.id
exports.deleteOne = (model, checkUser) => {
  return catchAsync(async (req, res, next) => {
    const data = await model.findByIdAndDelete(req.params.id); // Tìm tài liệu cần xóa bằng findByIdAndDelete
    if (!data) return next(new error("No document found with that ID", 404)); // nếu ko tìm thấy 

    res.status(200).json({
      status: "success",
      data: null, // Trả về response trạng thái thành công với data: null
    });
  });
};

// Cập nhật một tài liệu trong cơ sở dữ liệu.
// Dùng khi cần cập nhật các tài liệu có quyền truy cập cụ thể, như hội thoại hoặc tin nhắn.
exports.updateOne = (model, checkUser) => {
  return catchAsync(async (req, res, next) => {
    const data = await model.findByIdAndUpdate(req.params.id, req.body, { // Tìm và cập nhật tài liệu bằng findByIdAndUpdate
      new: true, // trả về tài liệu mới sau khi cập nhật.
      runValidator: true, //  đảm bảo dữ liệu nhập vào hợp lệ.
    });
    if (!data) return next(new error("No document found with that ID", 404));
    if (checkUser) {
      if (
        !data.participants
          .map((participant) => participant._id.toString())
          .includes(req.user._id.toString()) ||
        data.sender.toString() !== req.user._id.toString()
      ) {
        return next(
          new Error("You are not allowed to update this document", 401)
        );
      }
    }
    res.status(200).json({
      status: "success",
      data,
    });
  });
};

//  Lấy một tài liệu cụ thể từ cơ sở dữ liệu.
// Dùng để lấy dữ liệu chi tiết, ví dụ thông tin một hội thoại.
exports.getOne = (model, checkUser) => {
  return catchAsync(async (req, res, next) => {
    const data = await model.findById(req.params.id);
    if (!data) return next(new error("No document found with that ID", 404));
    if (checkUser) {
      if (
        !data.participants
          .map((participant) => participant._id.toString())
          .includes(req.user._id.toString())
      ) {
        return next(
          new error("You are not allowed to view this document", 401)
        );
      }
    }
    res.status(200).json({
      status: "success",
      data,
    });
  });
};

// : Lấy tất cả tài liệu từ cơ sở dữ liệu, có hỗ trợ các tính năng nâng cao như lọc, sắp xếp, phân trang.
exports.getAll = (model) => {
  return catchAsync(async (req, res, next) => {
    const features = new Features(model, req.query)
      .filter() // filter(): Lọc tài liệu dựa trên query string.
      .sort() // sort(): Sắp xếp tài liệu.
      .fields() // fields(): Chọn các trường cần trả về.
      .page(); // page(): Phân trang.
    const data = await features.query; // Thực hiện query với features.query.
    if (!data) return next(new error("No document found with that ID", 404));
    res.status(200).json({
      status: "success",
      data,
    });
  });
};
