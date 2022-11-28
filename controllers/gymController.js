import Gym from "../models/Gym.js";

export const fetch = async (req, res) => {
  const {
    query: { page = 1 },
  } = req;
  try {
    if (Number(page) <= 0) {
      return res.redirect(`/gym?page=1`);
    }
    const LIMIT_SIZE = 1;
    const SKIP_PAGE = (page - 1) * LIMIT_SIZE;
    const TOTAL_GYMS = await Gym.countDocuments();
    const TOTAL_PAGE = Math.ceil(TOTAL_GYMS / LIMIT_SIZE) || 1;
    const gyms = await Gym.find({})
      .skip(SKIP_PAGE)
      .limit(LIMIT_SIZE)
      .sort({ createdAt: -1 });
    return res.render("gym", {
      title: "체육관",
      gyms,
      totalPage: TOTAL_PAGE,
    });
  } catch (error) {
    console.log(error);
  }
};

export const upload = (req, res) => {
  return res.render("gymUpload", { csrfToken: req.csrfToken() });
};

export const uploadPost = async (req, res) => {
  const { body, files } = req;
  try {
    const returnPath = files.map((file) => {
      return file.path;
    });
    const newGym = new Gym({
      ...body,
      photos: returnPath,
      creator: req.user,
    });
    await newGym.save();
    return res.redirect("/gym");
  } catch (error) {
    console.log(error);
  }
};

export const detail = async (req, res) => {
  const {
    params: { gymId },
  } = req;
  console.log(gymId);
  try {
    const gym = await Gym.findById(gymId).populate("creator");
    return res.render("gymDetail", { title: gym.name, gym });
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
