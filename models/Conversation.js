import mongoose from "mongoose";

const ConversationSchema = mongoose.Schema(
  {
    users: [{ type: mongoose.SchemaTypes.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model("Conversation", ConversationSchema);

export default Conversation;
