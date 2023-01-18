import mongoose from "mongoose";

const MessageSchema = mongoose.Schema(
  {
    from: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    to: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    message: String,
    conversationId: String,
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", MessageSchema);

export default Message;
