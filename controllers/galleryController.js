import Gallery from "../models/Gallery.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";

export const fetch = async (req, res) => {
  const {
    query: { page = 1 },
  } = req;
  try {
    if (Number(page) <= 0) {
      return res.redirect(`/gallery?page=1`);
    }
    const LIMIT_SIZE = 1;
    const SKIP_PAGE = (page - 1) * LIMIT_SIZE;
    const TOTAL_GALLERY = await Gallery.countDocuments();
    const TOTAL_PAGE = Math.ceil(TOTAL_GALLERY / LIMIT_SIZE) || 1;
    const galleries = await Gallery.find({})
      .populate("creator")
      .skip(SKIP_PAGE)
      .limit(LIMIT_SIZE)
      .sort({ createdAt: -1 });

    return res.render("gallery", {
      title: "갤러리",
      galleries,
      totalPage: TOTAL_PAGE,
    });
  } catch (error) {
    console.log(error);
  }
};

export const fetchLikes = async (req, res) => {};

export const upload = (req, res) => {
  return res.render("galleryUpload", { csrfToken: req.csrfToken() });
};

export const uploadPost = async (req, res) => {
  const { body, files, user } = req;
  try {
    const returnPath = files.map((file) => {
      return file.path;
    });
    await Gallery.create({
      title: body.title,
      photos: returnPath,
      creator: req.user,
    });
    return res.redirect("/gallery");
  } catch (error) {}
};

export const detail = async (req, res) => {
  const {
    params: { galleryId },
  } = req;

  try {
    const gallery = await Gallery.findById(galleryId).populate("creator");
    const comments = await Comment.find({ where: galleryId }).populate(
      "creator"
    );

    return res.render("galleryDetail", {
      title: gallery.name,
      gallery,
      comments,
    });
  } catch (error) {
    console.log(error);
  }
};

export const update = async (req, res) => {
  const {
    params: { gymId },
  } = req;
  try {
    const gym = await Gym.findById(gymId).populate("creator");
    return res.render("gymUpdate", {
      title: gym.name,
      gym,
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    console.log(error);
  }
};

export const updatePost = async (req, res) => {
  const {
    params: { gymId },
    body,
    files,
  } = req;
  try {
    const gym = await Gym.findById(gymId);
    const returnPath = files.map((file) => {
      return file.path;
    });

    const updatedGym = await Gym.findByIdAndUpdate(gymId, {
      ...body,
      photos: returnPath.length > 0 ? returnPath : gym.photos,
    });
    return res.redirect(`/gym/${updatedGym._id}`);
  } catch (error) {
    console.log(error);
  }
};

export const remove = async (req, res) => {
  const {
    params: { gymId },
    user,
  } = req;
  try {
    const gym = await Gym.findById(gymId).populate("creator");
    if (String(user._id) !== String(gym.creator._id)) {
      req.flash("error", "사용자가 아닙니다!");
      res.redirect(`/gym`);
      return;
    } else {
      await gym.remove();
      req.flash("sucess", "삭제하였습니다.");
      res.redirect(`/gym`);
      return;
    }
  } catch (error) {
    console.log(error);
  }
};
