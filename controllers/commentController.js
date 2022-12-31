import Comment from "../models/Comment.js";
import Gym from "../models/Gym.js";

export const create = async (req, res) => {
  const {
    body: { text },
    params: { gymId },
    user: { _id: userId },
  } = req;
  try {
    const comment = await Comment.create({
      text,
      where: gymId,
      creator: userId,
    });
    await Gym.findOneAndUpdate(gymId, {
      $push: { comments: String(comment._id) },
    });
    res.status(201).json({ comment, user: req.user });
    // return res.redirect(`/gym/${gymId}`);
  } catch (error) {
    console.log(error);
    return res.status(400).json();
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
    return res.status(200).json({ Meseege: "Ok" });
    // res.redirect(`/gym/${gymId}`);
  } catch (error) {
    console.log(error);
    return res.status(400).json();
  }
};
