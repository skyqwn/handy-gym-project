import Post from "../models/Post.js";

export const fetch = async (req, res) => {
  const {
    query: { page = 1 },
  } = req;

  const searchQuery = new Object();
  let searchQueryString = "";
  if (req.query.searchTerm) {
    searchQuery.title = { $regex: req.query.searchTerm };
    searchQueryString += `&searchTerm=${req.query.seachTerm}`;
  }
  if (req.query.category) {
    searchQuery.category = req.query.category;
    searchQueryString += `&category=${req.query.category}`;
  }

  try {
    let PAGE = +page;

    const PAGE_SIZE = 1;
    const TOTAL_POSTS = await Post.countDocuments(searchQuery);
    const TOTAL_PAGE = Math.ceil(TOTAL_POSTS / PAGE_SIZE) || 1;

    if (!PAGE || PAGE < 1 || TOTAL_PAGE < PAGE) {
      return res.redirect(`/post?page=1${searchQueryString}`);
    }

    const posts = await Post.find(searchQuery)
      .skip(PAGE_SIZE * (PAGE - 1))
      .limit(PAGE_SIZE)
      .populate("creator");
    return res.render("post", { title: "post", totalPage: TOTAL_PAGE, posts });
  } catch (error) {
    console.log(error);
  }
};

export const upload = (req, res) => {
  return res.render("postUpload", { csrfToken: req.csrfToken() });
};

export const uploadPost = async (req, res) => {
  const { body } = req;
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
  } = req;
  try {
    const post = await Post.findById(postId);
    const updatedPost = await Post.findByIdAndUpdate(postId, {
      ...body,
    });
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
