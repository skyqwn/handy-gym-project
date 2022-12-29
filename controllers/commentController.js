import Comment from "../models/Comment.js";
import Gym from "../models/Gym.js";

export const create = async (req, res) => {
  const {
    body: { text },
    params: { gymId },
    user: { _id: userId },
  } = req;
  try {
    const newComment = await Comment.create({
      text,
      where: gymId,
      creator: userId,
    });
    await Gym.findOneAndUpdate(gymId, {
      $push: { comments: String(newComment._id) },
    });

    return res.redirect(`/gym/${gymId}`);
  } catch (error) {
    console.log(error);
  }
};

export const remove = async (req, res) => {
  const {
    params: { gymId, commentId },
  } = req;
  try {
    await Comment.findByIdAndDelete(commentId);

    await Gym.findOneAndUpdate(gymId, {
      $pull: { comments: commentId },
    });
    res.redirect(`/gym/${gymId}`);
  } catch (error) {
    console.log(error);
  }
};
