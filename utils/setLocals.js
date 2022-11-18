export default (req, res, next) => {
  res.locals.user = req.user || undefined;
  res.locals.message = req.flash();
  next();
};
