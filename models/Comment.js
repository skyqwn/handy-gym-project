import mongoose from "mongoose";

const CommentSchema = mongoose.Schema(
  {
    text: String,
    creator: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    where: String,
    like_users: [String],
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;
