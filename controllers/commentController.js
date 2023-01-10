import { stringify } from "uuid";
import Comment from "../models/Comment.js";
import Gym from "../models/Gym.js";
import Post from "../models/Post.js";
import Gallery from "../models/Gallery.js";

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
    if (type === "gym") {
      await Gym.findByIdAndUpdate(whereId, {
        $push: { comments: String(comment._id) },
      });
    }
    if (type === "post") {
      await Post.findByIdAndUpdate(whereId, {
        $push: { comments: String(comment._id) },
      });
    }
    if (type === "gallery") {
      await Gallery.findByIdAndUpdate(whereId, {
        $push: { comments: String(comment._id) },
      });
    }
    res.status(201).json({ comment, user: req.user });
    // return res.redirect(`/gym/${gymId}`);
  } catch (error) {
    console.log(error);
    return res.status(400).json();
  }
};

export const remove = async (req, res) => {
  const {
    params: { whereId, commentId },
  } = req;
  try {
    await Comment.findByIdAndDelete(commentId);

    await Gym.findById(whereId, {
      $pull: { comments: commentId },
    });
    return res.status(200).json({ Message: "Ok" });
    // res.redirect(`/gym/${gymId}`);
  } catch (error) {
    console.log(error);
    return res.status(400).json();
  }
};
