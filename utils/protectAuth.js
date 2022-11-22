export const onlyUser = (req, res, next) => {
  if (req.user) {
    return next();
  } else {
    req.flash("error", "로그인을 먼저 해주세요.");
    const redirectUrl = req.originalUrl || "";
    return res.redirect(`/signin?redirectUrl=${redirectUrl}`);
  }
};

export const onlyEmailVerified = (req, res, next) => {
  const emailVerified = req.user.emailVerify;
  if (emailVerified) {
    return next();
  } else {
    req.flash("error", "이메일 인증을 해주세요.");
    const redirectUrl = req.originalUrl || "";
    return res.redirect(`/no-access?redirectUrl=${redirectUrl}`);
  }
};
