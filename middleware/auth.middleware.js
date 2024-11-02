export const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).redirect("/auth/signin");
};

export const redirectIfAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.status(401).redirect("/dashboard");
  }

  return next();
};
