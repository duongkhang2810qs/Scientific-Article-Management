class Features {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    let query = {};
    const excludedFields = ["page", "sort", "limit", "fields"];
    const v = ["gte", "gt", "lte", "lt"];
    for (let key in this.queryString) {
      if (!excludedFields.includes(key)) {
        for (let key2 in this.queryString[key]) {
          if (v.includes(key2)) {
            query[key] = { [`$${key2}`]: this.queryString[key][key2] };
          } else {
            query[key] = this.queryString[key];
          }
        }
      }
    }
    this.query = this.query.find(query);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
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
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 30;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = Features;
