import Gym from "../models/Gym.js";
export const fetch = async (req, res, next) => {
  try {
    const gyms = await Gym.find().populate("creator");
    res.render("gym", { gyms });
  } catch (error) {
    next(error);
  }
};

export const upload = async (req, res, next) => {
  try {
    const gyms = await Gym.find().populate("creator");
    res.render("gymUpload", { gyms });
  } catch (error) {}
};

export const uploadPost = async (req, res, next) => {
  const {
    body: { title, desc },
  } = req;
  try {
    const gym = new Gym({
      title,
      desc,
    });
    await gym.save();
    req.flash("success", "업로드 성공!!");
    return res.redriect("/gym");
  } catch (error) {
    next(error);
  }
};

export const detail = async (req, res, next) => {
  const {
    params: { gymId },
  } = req;
  try {
    const gym = await Gym.findById(gymId).populate("creator");
    res.render("detail", { gym });
  } catch (error) {
    next(error);
  }
};

export const update = (req, res, next) => {
  const {
    params: { id },
  } = req;
  try {
    res.render("gymUpdate", {});
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  res.send("updatePost");
};

export const gymRemove = async (req, res, next) => {
  const {
    params: { id },
  } = req;
  try {
    await Gym.findByIdAndDelete(id);
    res.redriect("/gym");
  } catch (error) {
    next(error);
  }
};
