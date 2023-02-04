import Gallery from "../models/Gallery.js";
import Gym from "../models/Gym.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

export const detail = async (req, res) => {
  const {
    params: { userId },
  } = req;
  try {
    const findUser = await User.findById(userId);
    const gyms = await Gym.find({ creator: userId });
    const posts = await Post.find({ creator: userId });
    const galleries = await Gallery.find({ creator: userId });
    req.session.create_message_url = req.originalUrl;
    return res.render("userDetail", {
      title: `${findUser.nickname} 상세`,
      findUser,
      gyms,
      posts,
      galleries,
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    console.log(error);
  }
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
  console.log(file);

  try {
    await User.findByIdAndUpdate(
      user._id,
      {
        ...body,
        avatarUrl: file ? file.location : "",
      },
      {
        new: true,
      }
    );

    return res.redirect(`/user/${user._id}`);
  } catch (error) {
    console.log(error);
  }
};
