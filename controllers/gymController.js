import Gym from "../models/Gym.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";

export const fetch = async (req, res) => {
  const {
    query: { page = 1 },
  } = req;

  const searchQuery = new Object();
  let serchQueryString = "";

  if (req.query.searchTerm) {
    searchQuery.$or = [
      { name: { $regex: req.query.searchTerm } },
      { location: { $regex: req.query.searchTerm } },
    ];
    serchQueryString += `&searchTerm=${req.query.searchTerm}`;
  }
  if (req.query.oneday) {
    searchQuery.oneday = "가능";
    serchQueryString += `&oneday=on`;
  }
  if (req.query.yearRound) {
    searchQuery.yearRound = "네";
    serchQueryString += `&yearRound=on`;
  }
  try {
    let PAGE = +page;

    const LIMIT_SIZE = 1;
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
    });
  } catch (error) {
    console.log(error);
  }
};

export const fetchLikes = async (req, res) => {
  const { user } = req;
  try {
    const gyms = await Gym.find({ like_users: { $in: `${user._id}` } });
    res.render("likeGyms", { title: "좋아요", gyms });
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

  try {
    const gym = await Gym.findById(gymId).populate("creator");
    const comments = await Comment.find({ where: gymId }).populate("creator");

    return res.render("gymDetail", { title: gym.name, gym, comments });
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
    console.log(error);
  }
};

// export const like2 = async (req, res) => {
//   const {
//     params: { gymId },
//     user: { _id },
//   } = req;
//   const userId = String(_id);
//   try {
//     const currentUser = await User.findById(userId);
//     const currentGym = await Gym.findById(gymId);
//     const existsUser = currentGym.like_users.includes(userId);
//     if (existsUser) {
//       const deletedUserArr = currentGym.like_users.filter(
//         (user) => user !== userId
//       );
//       const deletedGymArr = currentUser.like_gyms.filter(
//         (gym) => String(gym._id) !== String(gymId)
//       );
//       currentGym.like_users = deletedUserArr;
//       currentUser.like_gyms = deletedGymArr;
//     } else {
//       currentGym.like_users.push(String(userId));
//       currentUser.like_gyms.push(currentGym._id);
//     }
//     await currentUser.save();
//     await currentGym.save();
//     return res.status(200).json();
//   } catch (error) {}
//   res.status(200).json({ message: `${req.params.gymId}로 좋아요 신청` });
// };

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
