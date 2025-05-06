const User = require("../models/user");
module.exports.renderSignupForm = (req, res) => {
  if (req.isUnauthenticated()) {
    return res.render("users/signup.ejs");
  }
  req.flash(
    "success",
    "You are already logged in. Please log out first if you'd like to switch accounts. "
  );
  res.redirect("/listings");
};
module.exports.registerUser = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    let user = new User({
      username: username,
      email: email,
    });
    let registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to WanderLust");
      res.redirect("/listings");
    });
    //    console.log(registeredUser);
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};
module.exports.renderLoginForm = (req, res) => {
  if (req.isUnauthenticated()) {
    return res.render("users/login.ejs");
  }
  req.flash("success", "You're already logged in. No need to log in again! ");
  res.redirect("/listings");
};
module.exports.loginUser = async (req, res) => {
  req.flash("success", "Welcome Back to WanderLust!");
  if (res.locals.redirectUrl) {
    // return res.redirect(req.session.redirectUrl);
    return res.redirect(res.locals.redirectUrl);
    //  //this is not working because after successful login passport removes resaves session info and thus this redirectUrl gets removed so we need to save redirectUrl in locals.
    // or wherever after successful login
  }
  return res.redirect("/listings");
};
module.exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "You are successfully logged out !");
    res.redirect("/listings");
  });
};
