const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/expresserror");
const Listing = require("../models/listing");
const { isLoggedIn, validateListing, isOwner } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });

const { listingSchema } = require("../schema.js");
const {
  index,
  renderNewForm,
  showListing,
  renderEditForm,
  postListing,
  updateListing,
  destroyListing,
} = require("../controllers/listings.js");
router
  .route("/")
  .get(wrapAsync(index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(postListing)
  );

router.route("/new").get(isLoggedIn, renderNewForm);

router
  .route("/:id")
  .get(isLoggedIn, wrapAsync(showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(destroyListing));

router.route("/:id/edit").get(isLoggedIn, isOwner, wrapAsync(renderEditForm));
module.exports = router;
