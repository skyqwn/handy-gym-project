import Gym from "../models/Gym.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";

export const fetch = async (req, res) => {
  const {
    query: { page = 1 },
  } = req;

  const searchQuery = new Object();
  let renderQuery = new Object();
  let serchQueryString = "";

  if (req.query.searchTerm) {
    searchQuery.$or = [
      { name: { $regex: req.query.searchTerm } },
      { location: { $regex: req.query.searchTerm } },
    ];
    serchQueryString += `&searchTerm=${req.query.searchTerm}`;
    renderQuery.searchTerm = req.query.searchTerm;
  }
  if (req.query.oneday) {
    searchQuery.oneday = "가능";
    serchQueryString += `&oneday=on`;
    renderQuery.isOneday = true;
  }
  if (req.query.yearRound) {
    searchQuery.yearRound = "네";
    serchQueryString += `&yearRound=on`;
    renderQuery.isYearRound = true;
  }
  try {
    let PAGE = +page;

    const LIMIT_SIZE = 10;
    const SKIP_PAGE = (PAGE - 1) * LIMIT_SIZE;
    // const TOTAL_GYMS = await Gym.countDocuments();//수정부문
    const TOTAL_GYMS = await Gym.countDocuments(searchQuery); //수정부문
    const TOTAL_PAGE = Math.ceil(TOTAL_GYMS / LIMIT_SIZE) || 1;

    if (TOTAL_PAGE < PAGE || PAGE < 1 || !PAGE) {
      return res.redirect(`/gym?page=1${serchQueryString}`);
    }
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
      renderQuery,
    });
  } catch (error) {
    req.flash("error", "서버 오류 발생하였습니다 다시 시도해주세요.");
    return res.redirect("/");
  }
};

export const fetchLikes = async (req, res) => {
  const { user } = req;
  try {
    const gyms = await Gym.find({ like_users: { $in: `${user._id}` } });
    res.render("likeGyms", { title: "좋아요", gyms });
  } catch (error) {
    req.flash("error", "서버 오류 발생하였습니다 다시 시도해주세요.");
    return res.redirect("/");
  }
};

export const upload = (req, res) => {
  return res.render("gymUpload", { csrfToken: req.csrfToken() });
};

export const uploadPost = async (req, res) => {
  const { body, files } = req;
  try {
    const returnLocation = files.map((file) => {
      return file.location;
    });
    const newGym = new Gym({
      ...body,
      photos: returnLocation,
      creator: req.user,
    });
    await newGym.save();
    return res.redirect("/gym");
  } catch (error) {
    req.flash("error", "서버 오류 발생하였습니다 다시 시도해주세요.");
    return res.redirect("/");
  }
};

export const detail = async (req, res) => {
  const {
    params: { gymId },
    cookies,
  } = req;
  const HOUR = 1000 * 60 * 60;
  const DAY = HOUR * 24;
  try {
    const gym = await Gym.findById(gymId).populate("creator");
    const comments = await Comment.find({ where: gymId }).populate("creator");

    if (!cookies[gymId] || +cookies[gymId] < Date.now()) {
      res.cookie(gymId, Date.now() + DAY, {
        expires: new Date(Date.now() + DAY + HOUR * 9),
      });
      gym.views++;
      await gym.save();
    }

    return res.render("gymDetail", { title: gym.name, gym, comments });
  } catch (error) {
    req.flash("error", "서버 오류 발생하였습니다 다시 시도해주세요.");
    return res.redirect("/");
  }
};

export const update = async (req, res) => {
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
      return res.render("gymUpdate", {
        title: gym.name,
        gym,
        csrfToken: req.csrfToken(),
      });
    }
  } catch (error) {
    req.flash("error", "서버 오류 발생하였습니다 다시 시도해주세요.");
    return res.redirect("/");
  }
};

export const updatePost = async (req, res) => {
  const {
    params: { gymId },
    body,
    files,
    user,
  } = req;
  try {
    const gym = await Gym.findById(gymId);
    const returnLocation = files.map((file) => {
      return file.location;
    });

    if (String(user._id) !== String(gym.creator._id)) {
      req.flash("error", "사용자가 아닙니다!");
      res.redirect(`/gym`);
      return;
    } else {
      const updatedGym = await Gym.findByIdAndUpdate(gymId, {
        ...body,
        photos: returnLocation.length > 0 ? returnLocation : gym.photos,
      });
      return res.redirect(`/gym/${updatedGym._id}`);
    }
  } catch (error) {
    req.flash("error", "서버 오류 발생하였습니다 다시 시도해주세요.");
    return res.redirect("/");
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
    req.flash("error", "서버 오류 발생하였습니다 다시 시도해주세요.");
    return res.redirect("/");
  }
};

export const like = async (req, res) => {
  const {
    params: { gymId },
    user: { _id },
  } = req;
  const userId = String(_id);
  try {
    const gym = await Gym.findById(gymId);
    const existsUser = gym.like_users.includes(userId);
    if (existsUser) {
      await Gym.findByIdAndUpdate(gymId, {
        $pull: { like_users: userId },
      });
    } else {
      await Gym.findByIdAndUpdate(gymId, {
        $push: { like_users: userId },
      });
    }
    res.status(200).json(gymId); // 이거 왜보내는거징?
  } catch (error) {
    req.flash("error", "서버 오류 발생하였습니다 다시 시도해주세요.");
    return res.redirect("/");
  }
};
