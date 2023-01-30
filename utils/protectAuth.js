export const onlyUser = (req, res, next) => {
  if (req.user) {
    return next();
  }
  req.flash("error", "로그인을 해야 이용가능합니다");
  const redirectUrl = req.originalUrl || "";
  return res.redirect(`/signin?redirectUrl=${redirectUrl}`);
};

export const onlyEmailVerified = (req, res, next) => {
  if (req.user.email_verified) {
    return next();
  }
  req.flash("error", "이메일 인증을 해야 이용가능합니다");
  const redirectUrl = req.originalUrl || "";
  return res.redirect(
    `/no-access?redirectUrl=${redirectUrl}&&disAllowedType=email`
  );
};
