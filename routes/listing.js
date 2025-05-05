const express = require("express");
const router = express.Router({ mergeParams: true })
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/expresserror");
const Listing = require("../models/listing");
const {isLoggedIn,validateListing,isOwner}= require("../middleware.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");

//  const upload = multer({ dest: 'uploads/' })
const upload = multer({ storage })



const {listingSchema} = require("../schema.js");
const {index, renderNewForm, showListing, renderEditForm, postListing, updateListing,destroyListing}  = require("../controllers/listings.js");
router.route('/')
.get(wrapAsync(index))
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(postListing));
// .post(isLoggedIn,upload.single('listing[image]'),wrapAsync((req,res)=>{
//     res.send(req.file);

// }));

router.route('/new')
.get(isLoggedIn,renderNewForm);


router.route('/:id')
.get(isLoggedIn,wrapAsync(showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(destroyListing));


router.route("/:id/edit")
.get(isLoggedIn,isOwner,wrapAsync(renderEditForm));


//index route
// router.get("/",wrapAsync(index));
//new route

// router.get("/new",isLoggedIn,renderNewForm);
//show route
// router.get("/:id",isLoggedIn,wrapAsync(showListing));
//edit route
// router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(renderEditForm));
//create listings
// router.post("/",isLoggedIn,validateListing,wrapAsync(postListing));
//update route
// router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(updateListing));
//Delete Route
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(destroyListing));
module.exports = router;