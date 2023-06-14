
import mongoose from "mongoose";
const messageSchma = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      trim: true,
      required:true
    },


    is_message_read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const messageModel = mongoose.model("Message", messageSchma);
export default messageModel;


