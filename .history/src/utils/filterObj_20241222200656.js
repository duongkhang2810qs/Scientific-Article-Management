const filterObj = (obj, ...allowedFields) => {
 // Hàm filterObj lọc một đối tượng (obj), chỉ giữ lại các trường (fields) được phép (allowedFields).
  let newObj = {}; // Khởi tạo đối tượng mới để lưu các trường được phép.
  for (let key in obj) { // Duyệt qua tất cả các trường (key) trong đối tượng obj.
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key]; // Thêm trường đó vào đối tượng mới.
    }
  }
  return newObj; // Trả về đối tượng mới chỉ chứa các trường được phép.
};

module.exports = filterObj;  // Xuất hàm để sử dụng ở các file khác
