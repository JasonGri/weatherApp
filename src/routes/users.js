const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const UserRepo = require("../repositories/users");
const auth = require("../middlewares/auth");

const initializePassport = require("../configs/passport");
initializePassport(
  passport,
  (email) => UserRepo.findByEmail(email),
  (id) => UserRepo.findById(id)
);

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Users");
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, password2 } = req.body;

    //Check if email already exists
    if ((await UserRepo.findByEmail(email)).length !== 0) {
      req.flash("failure", "Email already exist!");
      return res.redirect("register");
    }
    // Check if passwords match
    if (password !== password2) {
      req.flash("failure", "Passwords did not match!");
      return res.redirect("register");
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await UserRepo.insert(username, hashedPassword, email);

    console.log(newUser);
    req.flash("success", "Account Successfully Created");
    res.redirect("login");
  } catch (e) {
    req.flash("failure", "Account was not created!");
    res.redirect("register");
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "login",
    failureFlash: true,
  })
);

router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.get("/register", (req, res) => {
  const context = {
    flashMessages: {
      error: req.flash("failure"),
      success: req.flash("success"),
    },
  };
  res.render("pages/register", context);
});

router.get("/login", (req, res) => {
  const context = {
    flashMessages: {
      error: req.flash("failure"),
      success: req.flash("success"),
    },
  };
  res.render("pages/login", context);
});

router.get("/profile", auth.checkAuth, (req, res, next) => {
  res.render("pages/profile");
});

module.exports = router;
