import Comment from "../models/Comment.js";
import Gallery from "../models/Gallery.js";
import Gym from "../models/Gym.js";
import Post from "../models/Post.js";

export const create = async (req, res) => {
  const {
    body: { text, type },
    params: { whereId },
    user: { _id: userId },
  } = req;
  try {
    const comment = await Comment.create({
      text,
      where: whereId,
      creator: userId,
    });
    if (type === "post") {
      await Post.findByIdAndUpdate(
        whereId,
        {
          $push: { comments: String(comment._id) },
        },
        {
          new: true,
        }
      );
    }
    if (type === "gym") {
      await Gym.findByIdAndUpdate(
        whereId,
        {
          $push: { comments: String(comment._id) },
        },
        {
          new: true,
        }
      );
    }
    if (type === "gallery") {
      await Gallery.findByIdAndUpdate(
        whereId,
        {
          $push: { comments: String(comment._id) },
        },
        {
          new: true,
        }
      );
    }
    return res.status(201).json({ comment, user: req.user });
  } catch (error) {
    return res.status(400).json();
  }
};

export const update = (req, res) => {
  console.log("데이트");
};

export const remove = async (req, res) => {
  const {
    params: { commentId, whereId },
    query: { type },
  } = req;
  try {
    await Comment.findByIdAndDelete(commentId);
    if (type === "post") {
      await Post.findByIdAndUpdate(
        whereId,
        {
          $pull: { comments: String(commentId) },
        },
        {
          new: true,
        }
      );
    }
    if (type === "gym") {
      await Gym.findByIdAndUpdate(
        whereId,
        {
          $pull: { comments: String(commentId) },
        },
        {
          new: true,
        }
      );
    }
    if (type === "gallery") {
      await Gallery.findByIdAndUpdate(
        whereId,
        {
          $pull: { comments: String(commentId) },
        },
        {
          new: true,
        }
      );
    }
    return res.status(200).json({ message: "삭제성공" });
  } catch (error) {
    console.log(error);
    return res.status(400).json();
  }
};
