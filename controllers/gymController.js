import Gym from "../models/Gym.js";

export const fetch = async (req, res) => {
  const {
    query: { page = 1 },
  } = req;
  const searchQuery = new Object();
  if (req.query.searchTerm) {
    searchQuery.$or = [
      { name: { $regex: req.query.searchTerm } },
      { location: { $regex: req.query.searchTerm } },
    ];
  }
  if (req.query.oneday) {
    searchQuery.oneday = "가능";
  }
  if (req.query.yearRound) {
    searchQuery.yearRound = "네";
  }
  try {
    if (Number(page) <= 0) {
      return res.redirect(`/gym?page=1`);
    }
    const LIMIT_SIZE = 1;
    const SKIP_PAGE = (page - 1) * LIMIT_SIZE;
    // const TOTAL_GYMS = await Gym.countDocuments();//수정부문
    const TOTAL_GYMS = await Gym.countDocuments(searchQuery); //수정부문
    const TOTAL_PAGE = Math.ceil(TOTAL_GYMS / LIMIT_SIZE) || 1;
    // const gyms = await Gym.find({})
    const gyms = await Gym.find(searchQuery) //수정
      .populate("creator")
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
  console.log(body);
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
    console.log(gym);
    console.log(gymId);
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

// export const search = async (req, res) => {
//   const { query } = req;
//   const searchQuery = new Object();
//   if (query.searchTerm) {
//     searchQuery.$or = [
//       { name: { $regex: query.searchTerm } },
//       { location: { $regex: query.searchTerm } },
//     ];
//   }
//   if (query.oneday) {
//     searchQuery.oneday = "가능";
//   }
//   if (query.yearRound) {
//     searchQuery.yearRound = "네";
//   }
//   try {
//     const searchedGym = await Gym.find(searchQuery).populate("creator");
//     res.render("gym", { gyms: searchedGym });
//   } catch (error) {
//     console.log(error);
//   }
// };
