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
    const returnPath = files.map((__, index) => {
      return { photo: files[index].path, caption: body.captions[index] };
    });
    console.log(returnPath);
    const newGallery = await Gallery.create({
      ...body,
      photos: returnPath,
      creator: user,
    });

    console.log(newGallery);
    // const newGallery = new Gallery({
    //   ...body,
    //   photos: returnPath,
    //   creator: user,
    // });
    // await newGallery.save();
    return res.redirect("/gallery");
  } catch (error) {}
};

export const detail = async (req, res) => {
  const {
    params: { galleryId },
  } = req;

  try {
    const gallery = await Gallery.findById(galleryId).populate("creator");
    // const comments = await Comment.find({ where: galleryId }).populate(
    //   "creator"
    // );

    return res.render("galleryDetail", {
      title: gallery.title,
      gallery,
      // comments,
    });
  } catch (error) {
    console.log(error);
  }
};

export const update = async (req, res) => {
  const {
    params: { galleryId },
  } = req;
  try {
    const gallery = await Gallery.findById(galleryId).populate("creator");
    console.log(gallery);
    return res.render("galleryUpdate", {
      title: gallery.title,
      gallery,
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    console.log(error);
  }
};

export const updatePost = async (req, res) => {
  const {
    params: { galleryId },
    body,
    files,
    user,
  } = req;
  try {
    const gallery = await Gallery.findById(galleryId);
    const returnPath = files.map((__, index) => {
      return { photo: files[index].path, caption: body.captions[index] };
    });
    console.log(returnPath);
    const newGallery = await Gallery.findByIdAndUpdate(
      galleryId,
      {
        ...body,
        photos: returnPath,
        creator: user,
      },
      {
        $new: true,
      }
    );
    console.log(newGallery);
    return res.redirect(`/gallery/${newGallery._id}`);
  } catch (error) {
    console.log(error);
  }
};

export const remove = async (req, res) => {
  const {
    params: { galleryId },
    user,
  } = req;
  try {
    const gallery = await Gallery.findById(galleryId).populate("creator");
    if (String(user._id) !== String(gallery.creator._id)) {
      req.flash("error", "사용자가 아닙니다!");
      res.redirect(`/gallery`);
      return;
    } else {
      await gallery.remove();
      req.flash("sucess", "삭제하였습니다.");
      res.redirect(`/gallery`);
      return;
    }
  } catch (error) {
    console.log(error);
  }
};
