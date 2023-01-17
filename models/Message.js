import mongoose from "mongoose";

const MessageSchema = mongoose.Schema(
  {
    from: String,
    to: String,
    message: String,
    conversationId: String,
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", MessageSchema);

export default Message;
