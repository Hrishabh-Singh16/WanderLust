const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/expresserror");
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const {
  renderSignupForm,
  registerUser,
  renderLoginForm,
  loginUser,
  logoutUser,
} = require("../controllers/user");

router.route("/signup").get(renderSignupForm).post(registerUser);
router
  .route("/login")
  .get(renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: { type: "error", message: "Invalid username or password" },
    }),
    loginUser
  );
router.route("/logout").get(logoutUser);

module.exports = router;
