import User from "../models/User.js";
import Gym from "../models/Gym.js";
import Post from "../models/Post.js";
import Gallery from "../models/Gallery.js";
import Conversation from "../models/Conversation.js";

export const findEmail = (req, res) => {
  res.send("Find Email");
};

export const findEmailPost = (req, res) => {
  res.send("Find Email Post");
};

export const detail = async (req, res) => {
  const {
    params: { userId },
  } = req;
  try {
    const findUser = await User.findById(userId);
    const gyms = await Gym.find({ creator: userId });
    const posts = await Post.find({ creator: userId });
    const galleries = await Gallery.find({ creator: userId });
    const conversations = await Conversation.find({
      users: { $in: [req.user._id] },
    }).populate("users");
    return res.render("userDetail", {
      title: "userDetail",
      findUser,
      gyms,
      posts,
      galleries,
      conversations,
    });
  } catch (error) {
    console.log(error);
  }
};

export const me = (req, res) => {
  res.render("me", { title: "내정보", user: req.user });
};

export const update = (req, res) => {
  res.render("userUpdate", {
    title: "내정보수정",
    csrfToken: req.csrfToken(),
    user: req.user,
  });
};

export const updatePost = async (req, res) => {
  const { body, file, user } = req;

  try {
    await User.findByIdAndUpdate(
      user._id,
      {
        ...body,
        // avatarUrl: file?.path,
        avatarUrl: file ? file.path : "",
      },
      {
        new: true,
      }
    );
    res.redirect("/user/me");
  } catch (error) {
    console.log(error);
  }
};
