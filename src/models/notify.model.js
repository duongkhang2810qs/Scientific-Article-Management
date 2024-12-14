const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const Notify = mongoose.Schema(
  {
    ThongBao: {
      type: String,
      required: [true, "cần nhập tên thông báo!!!"],
    },
    NoiDung: {
      type: String,
      required: [true, "cần nhập nội dung!!!"],
    },
    NgayDang: Date,
    file: [],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    collection: "Notify",
    timestamps: true,
  }
);

const NotifyModels = mongoose.model("Notify", Notify);
module.exports = NotifyModels;
