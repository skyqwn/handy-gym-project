import Gallery from "../models/Gallery.js";

export const fetch = async (req, res) => {
  const {
    query: { page = 1 },
  } = req;
  try {
    if (Number(page) <= 0) {
      return res.redirect(`/gallery?page=1`);
    }
    const LIMIT_SIZE = 6;
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
  const {
    body: { title, captions },
    files,
    user,
  } = req;

  let captionsArr = new Array();

  if (typeof captions === "string") {
    captionsArr.push(captions);
  } else {
    captionsArr = captions;
  }
  try {
    const photosObjArr = files.map((__, index) => {
      return { photo: files[index].path, caption: captionsArr[index] };
    });
    const newGallery = await Gallery.create({
      title,
      photos: photosObjArr,
      creator: user,
    });
    await newGallery.save();

    return res.redirect("/gallery");
  } catch (error) {
    console.log(error);
  }
};

export const detail = async (req, res) => {
  const {
    params: { galleryId },
    cookies,
  } = req;
  const HOUR = 1000 * 60 * 60;
  const DAY = HOUR * 24;
  try {
    const gallery = await Gallery.findById(galleryId).populate("creator");
    // const comments = await Comment.find({ where: galleryId }).populate(
    //   "creator"
    // );
    if (!cookies[galleryId] || +cookies[galleryId] < Date.now()) {
      res.cookie(galleryId, Date.now() + DAY, {
        expires: new Date(Date.now() + DAY + HOUR * 9),
      });
      gallery.views++;
      await gallery.save();
    }

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
