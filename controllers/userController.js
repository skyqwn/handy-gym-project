import User from "../models/User.js";

export const findEmail = (req, res) => {
  res.send("Find Email");
};

export const findEmailPost = (req, res) => {
  res.send("Find Email Post");
};

export const detail = (req, res) => {
  res.send("User Detail");
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
        avatarUrl: file?.path,
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
