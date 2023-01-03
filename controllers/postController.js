import Post from "../models/Post.js";

export const fetch = async (req, res) => {
  const {
    query: { page = 1 },
  } = req;
  try {
    if (Number(page) <= 0) {
      return res.redirect(`/post?page=1`);
    }
    const LIMIT_SIZE = 10;
    const SKIP_PAGE = (page - 1) * LIMIT_SIZE;
    const TOTAL_POSTS = await Post.countDocuments();
    const TOTAL_PAGE = Math.ceil(TOTAL_POSTS / LIMIT_SIZE) || 1;
    const posts = await Post.find({})
      .skip(SKIP_PAGE)
      .limit(LIMIT_SIZE)
      .sort({ createdAt: -1 })
      .populate("creator");
    return res.render("post", {
      title: "포스트",
      posts,
      totalPage: TOTAL_PAGE,
    });
  } catch (error) {
    console.log(error);
  }
};

export const upload = (req, res) => {
  return res.render("postUpload", { csrfToken: req.csrfToken() });
};

export const uploadPost = async (req, res) => {
  const { body, files } = req;
  try {
    const newPost = new Post({
      ...body,
      creator: req.user,
    });
    console.log(newPost);
    await newPost.save();
    return res.redirect("/post");
  } catch (error) {
    console.log(error);
  }
};

export const detail = async (req, res) => {
  const {
    params: { postId },
  } = req;
  try {
    const post = await Post.findById(postId).populate("creator");
    return res.render("postDetail", { title: post.name, post });
  } catch (error) {
    console.log(error);
  }
};

export const update = async (req, res) => {
  const {
    params: { postId },
  } = req;
  try {
    const post = await Post.findById(postId).populate("creator");
    return res.render("postUpdate", {
      title: post.name,
      post,
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    console.log(error);
  }
};

export const updatePost = async (req, res) => {
  const {
    params: { postId },
    body,
    files,
  } = req;
  try {
    const post = await Post.findById(postId);
    // const returnPath = files.map((file) => {
    //   return file.path;
    // });
    const updatedPost = await Post.findByIdAndUpdate(postId, {
      ...body,
      // photos: returnPath > 0 ? returnPath : post.photos,
    });
    console.log(updatedPost);
    return res.redirect(`/post/${updatedPost._id}`);
  } catch (error) {
    console.log(error);
  }
};

export const remove = async (req, res) => {
  const {
    params: { postId },
    user,
  } = req;
  try {
    const post = await Post.findById(postId).populate("creator");
    if (String(user._id) !== String(post.creator._id)) {
      req.flash("error", "사용자가 아닙니다!");
      return res.redirect(`/post`);
    } else {
      await post.remove();
      req.flash("sucess", "삭제하였습니다.");
      return res.redirect(`/post`);
    }
  } catch (error) {
    console.log(error);
  }
};
