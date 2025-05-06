const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/expresserror");
const { reviewSchema } = require("../schema");
const Review = require("../models/review");
const Listing = require("../models/listing");
const { validateReview, isLoggedIn, isAuthor } = require("../middleware");
const { postReview, destroyReview } = require("../controllers/review");

//post review route
router.route("/").post(isLoggedIn, validateReview, wrapAsync(postReview));

//Delete Review route
router
  .route("/:reviewId")
  .delete(isLoggedIn, isAuthor, wrapAsync(destroyReview));
module.exports = router;
