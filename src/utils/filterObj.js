const filterObj = (obj, ...allowedFields) => {
  let newObj = {};
  for (let key in obj) {
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
};

module.exports = filterObj;
