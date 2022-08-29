module.exports = {
  // Check if user is logged in
  checkAuth: (req, res, next) => {
    if (req.isAuthenticated()) next();
    res.redirect("login");
  },

  // creates a local login variable with a boolean value (for template use)
  isLoggedIn: (req, res, next) => {
    res.locals.login = req.isAuthenticated();
    next();
  },
};
