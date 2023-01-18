import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

export const fetch = async (req, res) => {
  const {
    query: { page = 1 },
    user,
  } = req;
  console.log(user);

  const searchQuery = new Object();
  const sortQuery = new Object();
  let renderQuery = new Object();
  let searchQueryString = "";
  if (req.query.searchTerm) {
    searchQuery.title = { $regex: req.query.searchTerm };
    searchQueryString += `&searchTerm=${req.query.searchTerm}`;
    renderQuery.searchTerm = req.query.searchTerm;
  }
  if (req.query.category && req.query.category !== "모두") {
    searchQuery.category = req.query.category;
    searchQueryString += `&category=${req.query.category}`;
    renderQuery.category = req.query.category;
  }
  if (req.query.orderByRecommend) {
    sortQuery.like_user = -1;
    renderQuery.isRecommend = true;
  } else {
    sortQuery.createdAt = -1;
    renderQuery.isRecommend = false;
  }

  try {
    let PAGE = +page;

    const PAGE_SIZE = 10;
    const TOTAL_POSTS = await Post.countDocuments(searchQuery);
    const TOTAL_PAGE = Math.ceil(TOTAL_POSTS / PAGE_SIZE) || 1;

    if (!PAGE || PAGE < 1 || TOTAL_PAGE < PAGE) {
      return res.redirect(`/post?page=1${searchQueryString}`);
    }

    const posts = await Post.find(searchQuery)
      .skip(PAGE_SIZE * (PAGE - 1))
      .limit(PAGE_SIZE)
      .populate("creator")
      .sort({ createdAt: -1 });
    return res.render("post", {
      title: "post",
      totalPage: TOTAL_PAGE,
      posts,
      renderQuery,
      user,
    });
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

export const like = async (req, res) => {
  const {
    params: { postId },
    user: { _id },
  } = req;
  const userId = String(_id);
  try {
    const post = await Post.findById(postId);
    const existsUser = post.like_users.includes(userId);
    if (existsUser) {
      await Post.findByIdAndUpdate(postId, {
        $pull: { like_users: userId },
      });
    } else {
      await Post.findByIdAndUpdate(postId, {
        $push: { like_users: userId },
      });
    }
    res.status(200).json(postId); // 이거 왜보내는거징?
  } catch (error) {
    console.log(error);
  }
};

export const detail = async (req, res) => {
  const {
    params: { postId },
    cookies,
  } = req;
  const HOUR = 1000 * 60 * 60;
  const DAY = HOUR * 24;
  const CURRENT_MONTH = new Date().getMonth();
  try {
    const post = await Post.findById(postId).populate("creator");

    if (!cookies[postId] || +cookies[postId] < Date.now()) {
      res.cookie(postId, Date.now() + DAY, {
        expires: new Date(Date.now() + DAY + HOUR * 9),
      });
      post.views++;
      await post.save();
      // await post.findByIdAndUpdate({ postId }, { $inc: { views: 1 } });
    }

    const populatePost = await Post.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.UTC(2023, CURRENT_MONTH)),
            $lte: new Date(Date.UTC(2023, CURRENT_MONTH + 1)),
          },
        },
      },
      { $limit: 5 },
      { $sort: { views: -1 } },
    ]);
    //   {
    //   createdAt: { $month: new Date("2023-03-17") },
    // });
    console.log(populatePost);

    const comments = await Comment.find({ where: postId }).populate("creator");
    return res.render("postDetail", {
      title: post.name,
      post,
      comments,
      populatePost,
    });
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

export const views = async (req, res) => {
  const {
    params: { postId },
  } = req;
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
