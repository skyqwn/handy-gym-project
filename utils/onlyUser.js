export default (req, res, next) => {
  if (req.user) {
    next();
  }
  console.log("유저가 아닙니다.");
  return res.status(402);
};
