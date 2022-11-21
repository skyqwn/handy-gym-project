export const isVerifiedEmail = (req, res, next) => {
  const { user } = req; //
  if (!user.emailVerify) {
    req.flash("error", "이메일 인증을 먼저 해주세요!");
    return res.redirect("/join");
  }
  next();
};
