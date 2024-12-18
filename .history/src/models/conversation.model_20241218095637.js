const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const conversationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Conversation name is required"],
      trim: true,
    },
    participants: [
      {
        type: ObjectId,
        ref: "User",
        required: true,
      },
    ],
    isGroup: {
      type: Boolean,
      default: false,
    },
    admin: {
      type: ObjectId,
      ref: "User",
    },

    images: [
      {
        type: String,
      },
    ],
  },
  {
    collection: "Conversation",
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
conversationSchema.pre(/^find/, function (next) {
  this.populate("participants", "_id name avatar").populate("messages"); // Populate participants field with only _id
  //this.find({ participants: this._conditions.user._id }); // Filter conversations by user ID
  next();
});
conversationSchema.virtual("messages", {
  ref: "Message",
  foreignField: "conversation",
  localField: "_id",
});

const Conversation = mongoose.model("Conversation", conversationSchema);
module.exports = Conversation;
