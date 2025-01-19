export const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(303).redirect("/auth/signin");
};

export const redirectIfAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    return res.status(401).redirect("/dashboard");
  }

  return next();
};
