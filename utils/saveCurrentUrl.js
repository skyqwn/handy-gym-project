export default (req, res, next) => {
  req.session.current_url = req.originalUrl;
  next();
};
