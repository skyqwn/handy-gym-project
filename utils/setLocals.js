import dotenv from "dotenv";
dotenv.config();

export default (req, res, next) => {
  res.locals.user = req.user || undefined;
  res.locals.message = req.flash();
  res.locals.kakaoMapKey = process.env.KAKAO_MAP_KEY || "";
  next();
};
