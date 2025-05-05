const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/expresserror");
const {listingSchema,reviewSchema} = require("./schema");
module.exports.isLoggedIn =(req,res,next)=>{
    if(!req.isAuthenticated()){
      //req.path gives relative url and req.originalUrl gives aboslute path of the url which we were trying to access.
      req.session.redirectUrl = req.originalUrl;
      // console.log(req.session.redirectUrl);
        req.flash("error","You must be logged in !");
        res.redirect("/login");
        
      }
      else{
        next();
      }
}
module.exports.saveRedirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
    
  }
  next();
}
module.exports.isOwner = async(req,res,next) =>{
  let {id} = req.params;
  let data = await Listing.findById(id);
  if(!(data.owner.equals(res.locals.CurrUser._id))){
    req.flash("error","You are not the owner of this listing.");
  return res.redirect(`/listings/${id}`);
    

  }
  next();
}
module.exports.isAuthor = async(req,res,next) =>{
  let {id,reviewId} = req.params;
  let review = await Review.findById(reviewId);

  if( !(review.author.equals(res.locals.CurrUser._id))){
    req.flash("error","You are not the author of this review .");
  return res.redirect(`/listings/${id}`);
    

  }
  next();
}
module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    // console.log(response);
    
    if(error){
        console.log(error);
        console.log(error.details);
      let errMsg = error.details.map((el)=>{
        return el.message;
      }).join(",")
      throw new ExpressError(400,errMsg);
    }else{
      next();
    }
  
  }
  module.exports.validateReview = (req,res,next)=>{
      let {error} = reviewSchema.validate(req.body);
      // console.log(response);
      
      if(error){
        console.log(error);
        console.log(error.details);
    
    
        let errMsg = error.details.map((el)=>{
          return el.message;
        }).join(",")
        throw new ExpressError(400,errMsg);
      }else{
        next();
      }
    
    }
  