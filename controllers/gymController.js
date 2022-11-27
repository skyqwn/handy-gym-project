import Gym from "../models/Gym.js";

export const fetch = async (req, res) => {
  const {
    query: { page },
  } = req;
  try {
    const LIMIT_SIZE = 1;
    const SKIP_PAGE = (page - 1) * LIMIT_SIZE;
    const TOTAL_GYMS = await Gym.countDocuments();
    const TOTAL_PAGE = Math.ceil(TOTAL_GYMS / LIMIT_SIZE);
    const gyms = await Gym.find({}).skip(SKIP_PAGE).limit(LIMIT_SIZE);
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
  return res.render("gymUpload");
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
    });
    await newGym.save();
    return res.redirect("/gym");
  } catch (error) {
    console.log(error);
  }
};

export const detail = (req, res) => {
  return res.render("gymDetail");
};

export const update = (req, res) => {
  return res.render("gymUpdate");
};

export const updatePost = (req, res) => {
  res.send("Gym UpdatePost");
};

export const remove = (req, res) => {
  res.send("Gym Remove");
};
