const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      trim: true,
    },
    sender: {
      type: ObjectId,
      required: true,
      ref: "User",
    },
    conversation: {
      type: ObjectId,
      required: true,
      ref: "Conversation",
    },
    videoCall: {
      hasCall: {
        type: Boolean,
        default: false,
      },
      hasRecording: {
        type: Boolean,
        default: false,
      },
    },
    files: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
    collection: "Message",
  }
);

messageSchema.pre("find", function (next) {
  this.populate("sender", "name");
  next();
});
messageSchema.pre("save", function (next) {
  this.populate("sender", "name");
  next();
});
const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
