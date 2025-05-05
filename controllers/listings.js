const Listing = require("../models/listing");
module.exports.index = async(req,res,next)=>{
  let allListings = await  Listing.find({});
  // console.log(allListings);
  res.render("listings/index.ejs",{allListings});

}
module.exports.renderNewForm = (req,res)=>{
  //checks for req.user id in session and make sures a user is logged in.
  
  res.render("listings/new.ejs");
}
module.exports.showListing = async(req,res)=>{

    const {id} = req.params;
    const data =  await Listing.findById(id).populate({path:"reviews",populate : {path:"author",model : "User"}}).populate("owner");
    if(!data){
      req.flash("error","The listing you requested for does not exist!");
      return res.redirect("/listings");
    }
    console.log(data);
    res.render("listings/show.ejs",{list : data});
  }
module.exports.renderEditForm = async(req,res)=>{
  const {id} = req.params;
  const data =  await Listing.findById(id);
  
  if(!data){
    req.flash("error","The listing you requested for does not exist!");
   return  res.redirect("/listings");
  }
    // console.log(data);

  let originalImageUrl = data.image.url;
  originalImageUrl = originalImageUrl.replace("/upload","/upload/e_blur:200,w_250");
  // console.log(originalImageUrl);

  res.render("listings/edit.ejs",{listing:data,originalImageUrl});
}
module.exports.postListing = async(req,res,next)=>{
    
    let url = req.file.path;
    let filename = req.file.filename;
    
  
  
      let listing = req.body.listing;
      console.log(listing);
      
      console.log(listing);
      let list = new Listing(
       listing
        
      );
      list.image = {url,filename};
      list.owner = req.user._id;
      let result = await list.save();
      req.flash("success","New Listing Created Successfully");
      // console.log(result);
      res.redirect("/listings");
  
    // }catch(err){
    //   // console.log(err);
    //   next(err);
    // }
   
  }
  module.exports.updateListing = async(req,res)=>{
    
 

    let listing = req.body.listing;
    
  
    // console.log(listing);
    let id = req.params.id;
    // console.log(id);
   let result = await Listing.findByIdAndUpdate(id,listing,{new:true,runValidators:true});
    if(typeof(req.file) !=="undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
  
      result.image = {url,filename};
      await result.save();

    }
    req.flash("success","Listing updated Successfully");
    return  res.redirect(`/listings/${id}`);
  
  
    
    
    
  }
  module.exports.destroyListing = async(req,res)=>{
    let id = req.params.id;
    let result = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted successfully");
    res.redirect("/listings");
    
    // console.log(result);
  }