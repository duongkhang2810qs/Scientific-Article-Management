class Features {
  constructor(query, queryString) {
    // `query`: MongoDB query (ví dụ: `Model.find()`).
    // `queryString`: Dữ liệu query từ URL (req.query trong Express).
    this.query = query; / /// Lưu trữ query hiện tại.
    this.queryString = queryString; // Lưu trữ thông tin query string.
  }
  filter() {
    // Lọc dữ liệu dựa trên các trường không nằm trong `excludedFields`.
    let query = {};
    const excludedFields = ["page", "sort", "limit", "fields"]; // Các trường không dùng để lọc.
    const v = ["gte", "gt", "lte", "lt"]; // Các toán tử MongoDB (>=, >, <=, <).
    for (let key in this.queryString) {
      if (!excludedFields.includes(key)) {
        for (let key2 in this.queryString[key]) {
          if (v.includes(key2)) {    // Nếu key2 là toán tử, áp dụng lọc theo MongoDB (e.g., `$gte`, `$lt`).
            query[key] = { [`$${key2}`]: this.queryString[key][key2] };
          } else {
            query[key] = this.queryString[key];  // Áp dụng lọc theo giá trị cụ thể.
          }
        }
      }
    }
    // Cập nhật query với điều kiện lọc.
    this.query = this.query.find(query);
    return this;
  }

  sort() {  // Sắp xếp dữ liệu.
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" "); // Tách nhiều trường và nối bằng dấu cách.
      this.query = this.query.sort(sortBy); // Áp dụng sắp xếp.
    } else {
      this.query = this.query.sort("-createdAt"); // Mặc định sắp xếp theo ngày tạo giảm dần.
    }
    return this;
  }
  //yêu cầu các trường cần truy vấn
  fields() {
    if (this.queryString.fields) {
      const fieldsBy = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fieldsBy);
    }
    return this;
  }
  page() {
    const page = this.queryString.page * 1 || 1; // Trang hiện tại (mặc định là 1).
    const limit = this.queryString.limit * 1 || 30; // Số lượng kết quả mỗi trang (mặc định là 30).
    const skip = (page - 1) * limit; // Tính số lượng kết quả cần bỏ qua.
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = Features;
