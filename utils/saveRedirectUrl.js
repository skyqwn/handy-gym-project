export default (req, res, next) => {
  if (req.query.redirectUrl) {
    req.session.redirectUrl = req.query.redirectUrl;
  }
  next();
};
