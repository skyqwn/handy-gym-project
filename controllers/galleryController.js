import Comment from "../models/Comment.js";
import Gallery from "../models/Gallery.js";

export const fetch = async (req, res) => {
  const {
    query: { page = 1 },
  } = req;
  try {
    const LIMIT_SIZE = 6;
    const SKIP_PAGE = (page - 1) * LIMIT_SIZE;
    const TOTAL_GALLERIES = await Gallery.countDocuments();
    const TOTAL_PAGE = Math.ceil(TOTAL_GALLERIES / LIMIT_SIZE) || 1;
    const galleries = await Gallery.find({})
      .skip(SKIP_PAGE)
      .limit(LIMIT_SIZE)
      .sort({ createdAt: -1 })
      .populate("creator");
    return res.render("gallery", { galleries, totalPage: TOTAL_PAGE });
  } catch (error) {
    req.flash("error", "갤러리를 불러오는 도중 서버 오류가 발생하였습니다.");
    return res.redirect("/");
  }
};

export const upload = async (req, res) => {
  try {
    res.render("galleryUpload", { csrfToken: req.csrfToken() });
  } catch (error) {
    console.log(error);
  }
};

export const uploadPost = async (req, res) => {
  const {
    body: { title, captions },
    files,
    user,
  } = req;

  let captionsArr = new Array();

  if (typeof captions === "string") {
    // 캡션이 한개일 때
    captionsArr.push(captions);
  } else {
    // 캡션이 여러개일 때
    captionsArr = captions;
  }

  try {
    const returnPhotosObj = files.map((__, index) => {
      return { photo: files[index].location, caption: captionsArr[index] };
    });

    await Gallery.create({
      title,
      photos: returnPhotosObj,
      creator: user._id,
    });

    return res.redirect("/gallery");
  } catch (error) {
    req.flash(
      "error",
      "갤러리를 업로드 도중 서버가 오류가 발상하였습니다. 서비스에 불편을 드려 죄송합니다"
    );
    return res.redirect("/");
  }
};

export const detail = async (req, res) => {
  const {
    params: { galleryId },
    cookies,
  } = req;
  const HOUR = 1000 * 60 * 60;
  const DAY = HOUR * 24;
  const CURRENT_MONTH = new Date().getMonth();
  try {
    const gallery = await Gallery.findById(galleryId).populate("creator");

    if (!cookies[galleryId] || +cookies[galleryId] < Date.now()) {
      res.cookie(galleryId, Date.now() + DAY, {
        expires: new Date(Date.now() + DAY + 9 * HOUR),
      });
      gallery.views++;
      await gallery.save();
    }

    const populateGalleries = await Gallery.aggregate([
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

    const comments = await Comment.find({ where: galleryId }).populate(
      "creator"
    );

    return res.render("galleryDetail", {
      title: gallery.title,
      gallery,
      comments,
      populateGalleries,
    });
  } catch (error) {
    req.flash(
      "error",
      "갤러리를 불러오는 도중 서버가 오류가 발상하였습니다.\n 서비스에 불편을 드려 죄송합니다"
    );
    return res.redirect("/gallery");
  }
};
export const update = async (req, res) => {
  const {
    params: { galleryId },
  } = req;
  try {
    const gallery = await Gallery.findById(galleryId).populate("creator");
    return res.render("galleryUpdate", {
      title: gallery.title,
      gallery,
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    req.flash(
      "error",
      "갤러리를 업데이트 도중 서버가 오류가 발상하였습니다.\n 서비스에 불편을 드려 죄송합니다"
    );
    return res.redirect("/gallery");
  }
};

export const updatePost = async (req, res) => {
  const {
    params: { galleryId },
    body: { title, captions },
    files,
  } = req;
  try {
    const returnPhotosObj = files.map((__, index) => {
      console.log(captions[index]);
      return { photo: files[index].location, caption: captions[index] };
    });

    const updatedGallery = await Gallery.findByIdAndUpdate(
      galleryId,
      {
        title,
        photos: returnPhotosObj,
      },
      {
        new: true,
      }
    );
    return res.redirect(`/gallery/${updatedGallery._id}`);
  } catch (error) {
    req.flash(
      "error",
      "갤러리를 업데이트 도중 서버가 오류가 발상하였습니다.\n 서비스에 불편을 드려 죄송합니다"
    );
    return res.redirect("/gallery");
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
    req.flash(
      "error",
      "갤러리를 삭제하는 도중 서버가 오류가 발상하였습니다.\n 서비스에 불편을 드려 죄송합니다"
    );
    return res.redirect("/gallery");
  }
};

export const like = async (req, res) => {
  const {
    params: { galleryId },
    user: { _id },
  } = req;
  const userId = String(_id);
  try {
    const currentGallery = await Gallery.findById(galleryId);
    const existsUser = currentGallery.like_users.includes(userId);
    if (existsUser) {
      await Gallery.findByIdAndUpdate(galleryId, {
        $pull: { like_users: userId },
      });
    } else {
      await Gallery.findByIdAndUpdate(galleryId, {
        $push: { like_users: userId },
      });
    }

    return res.status(200).json();
  } catch (error) {
    return res.status(400).json();
  }
};
