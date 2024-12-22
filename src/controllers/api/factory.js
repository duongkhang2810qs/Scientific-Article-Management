// Đoạn code này là một factory function để tái sử dụng logic xử lý CRUD (Create, Read, Update, Delete) 

const error = require("../../utils/error");
const catchAsync = require("../../utils/catchAsync");
const Features = require("../../utils/Features");

// Tạo một tài liệu mới trong cơ sở dữ liệu.
exports.createOne = (model) => { //Dùng model tương ứng để tạo một tài liệu mới từ dữ liệu trong req.body
  return catchAsync(async (req, res, next) => {
    const data = await model.create(req.body);
    //Nếu không có dữ liệu trả về, chuyển lỗi với thông báo "No document found with that ID"
    if (!data) return next(new error("No document found with that ID", 404));
    // Trả về trạng thái thành công cùng với dữ liệu vừa tạo
    res.status(200).json({
      status: "success",
      data: data,
    });
  });
};
// Xóa một tài liệu dựa trên req.params.id
exports.deleteOne = (model, checkUser) => {
  return catchAsync(async (req, res, next) => {
    // Tìm và xóa tài liệu dựa trên ID trong URL
    const data = await model.findByIdAndDelete(req.params.id);
    // Nếu không tìm thấy tài liệu, trả về lỗi "No document found with that ID"
    if (!data) return next(new error("No document found with that ID", 404));
    // Trả về phản hồi với trạng thái thành công, dữ liệu trả về là null
    res.status(200).json({
      status: "success",
      data: null,
    });
  });
};
// Cập nhật một tài liệu dựa trên ID và dữ liệu từ req.body
exports.updateOne = (model, checkUser) => {
  return catchAsync(async (req, res, next) => {
    const data = await model.findByIdAndUpdate(req.params.id, req.body, { //Tìm và cập nhật tài liệu theo ID
      new: true, //new: true: Trả về tài liệu đã được cập nhật.
      runValidator: true, //runValidator: true: Kiểm tra dữ liệu đầu vào theo schema
    });
    //Nếu không tìm thấy tài liệu, trả về lỗi.
    if (!data) return next(new error("No document found with that ID", 404));
    // Kiểm tra quyền (nếu checkUser bật)
    if (checkUser) {
      // Kiểm tra người dùng hiện tại có trong danh sách participants hoặc là sender
      if (
        !data.participants
          .map((participant) => participant._id.toString())
          .includes(req.user._id.toString()) ||
        data.sender.toString() !== req.user._id.toString()
      ) {
        // Nếu không, trả về lỗi: "You are not allowed to update this document"
        return next(
          new Error("You are not allowed to update this document", 401)
        );
      }
    }
    // Trả về phản hồi thành công cùng với tài liệu đã cập nhật.
    res.status(200).json({
      status: "success",
      data,
    });
  });
};

//  Lấy thông tin một tài liệu dựa trên ID.
exports.getOne = (model, checkUser) => {
  return catchAsync(async (req, res, next) => {
    // Tìm tài liệu theo ID từ URL
    const data = await model.findById(req.params.id); 
    // Kiểm tra dữ liệu: Nếu không tìm thấy tài liệu, trả về lỗi.
    if (!data) return next(new error("No document found with that ID", 404));
    // Kiểm tra quyền (nếu checkUser bật)
    if (checkUser) {
      // Kiểm tra người dùng hiện tại có trong danh sách participants 
      if (
        !data.participants
          .map((participant) => participant._id.toString())
          .includes(req.user._id.toString())
      ) {
        // // Nếu không, trả về lỗi: "You are not allowed to update this document"
        return next(
          new error("You are not allowed to view this document", 401)
        );
      }
    }
    // Trả về phản hồi thành công cùng với tài liệu tìm thấy.
    res.status(200).json({
      status: "success",
      data,
    });
  });
};

// Lấy danh sách tất cả các tài liệu theo các tiêu chí lọc, sắp xếp, phân trang.
exports.getAll = (model) => {
  return catchAsync(async (req, res, next) => {
    // Khởi tạo Features
    const features = new Features(model, req.query)
      .filter() //Lọc dữ liệu dựa trên các điều kiện.
      .sort() //Sắp xếp dữ liệu theo tiêu chí.
      .fields() //Chọn các trường cần lấy.
      .page(); //Phân trang.
    //Thực hiện query sau khi áp dụng các tính năng trên.
    const data = await features.query;
    // Nếu không tìm thấy tài liệu nào, trả về lỗi.
    if (!data) return next(new error("No document found with that ID", 404));
    // Trả về danh sách tài liệu thỏa mãn các tiêu chí.
    res.status(200).json({
      status: "success",
      data,
    });
  });
};
