Review = require("../models/review");
Listing = require("../models/listing");
module.exports.postReview = async(req,res)=>{
    let id = req.params.id;
    // console.log(id);
   let listing =  await Listing.findById(id);
//    console.log(listing);
   let newReview = new Review(req.body.review);
   newReview.author = res.locals.CurrUser._id;
   listing.reviews.push(newReview);
   await newReview.save();
   await listing.save();
   console.log("new Review saved");
   req.flash("success","New review Created Successfully");
   res.redirect(`/listings/${listing._id}`);
  
  
  
  
  
  }
  module.exports.destroyReview = async(req,res)=>{
    let id = req.params.id;
    let reviewId = req.params.reviewId;
     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
     await Review.findByIdAndDelete(reviewId);
    // console.log(del1);
    // console.log(del2);
    req.flash("success","Review deleted");
    res.redirect(`/listings/${id}`);
  
  
  }