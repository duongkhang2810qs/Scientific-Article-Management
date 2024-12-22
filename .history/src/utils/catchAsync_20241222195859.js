// Hàm catchAsync được sử dụng để bắt lỗi trong các hàm bất đồng bộ (async/await)
// nhằm tránh việc sử dụng nhiều khối try-catch trong code.
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {  // Chuyển lỗi đến middleware xử lý lỗi
      next(error);
    });
  };
};
// Xuất hàm catchAsync để có thể sử dụng ở các file khác
module.exports = catchAsync;
