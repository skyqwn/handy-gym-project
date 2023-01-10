import mongoose from "mongoose";

const PostSchema = mongoose.Schema(
  {
    title: String,
    description: String,
    creator: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    category: String,
    comments: [String],
    like_users: [String],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", PostSchema);

export default Post;
