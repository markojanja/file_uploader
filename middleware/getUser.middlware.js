const getUser = (req, res, next) => {
  res.locals.user = req.user || null;
  next();
};

export default getUser;
