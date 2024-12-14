const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const HoiDong = mongoose.Schema(
  {
    TenHoiDong: {
      type: String,
      required: [true, "cần nhập tên hội đồng!!!"],
    },
    ChuTich: {
      type: ObjectId,
      ref: "User",
      required: [true, "cần nhập chủ tịch"],
    },
    Thuky: {
      type: ObjectId,
      ref: "User",
      required: [true, "cần nhập thư ký"],
    },
    UyVien1: {
      type: ObjectId,
      ref: "User",
    },
    UyVien2: {
      type: ObjectId,
      ref: "User",
    },
  },
  {
    collection: "HoiDong",
    timestamps: true,
  }
);
const HoiDongModels = mongoose.model("HoiDong", HoiDong);
module.exports = HoiDongModels;
