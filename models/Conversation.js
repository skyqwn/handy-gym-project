import mongoose from "mongoose";

const ConversationSchema = mongoose.Schema(
  {
    users: [String],
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model("Conversation", ConversationSchema);

export default Conversation;
