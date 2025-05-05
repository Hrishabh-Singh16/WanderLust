const express = require("express");
const mongoose = require('mongoose');
if(process.env.NODE_ENV != "production"){
  require('dotenv').config()


}

const path = require("path");
const methodOverride = require('method-override')
 const ejsMate = require('ejs-mate');
 const ExpressError = require("./utils/expresserror");
 const listingRouter= require("./routes/listing");
 const reviewRouter = require("./routes/review");
 const userRouter = require("./routes/user");

 const session = require("express-session");
 const MongoStore = require('connect-mongo');

 const flash = require("connect-flash");
 const passport = require("passport");
 const LocalStrategy = require("passport-local");
 const User = require("./models/user");
const dbUrl = process.env.ATLASDB_URL;
 
main()
.then((result)=>{
    console.log("connection successful");
})
.catch(err => console.log(err));
async function main() {
  await mongoose.connect(dbUrl);

}
const app = express();
const port = 8080;
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname,"public/css")));
app.use(express.static(path.join(__dirname,"public/js")));
app.engine('ejs', ejsMate);
const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto: {
    secret: process.env.SECRET
  },
  touchAfter:24*3600,


});
store.on("error",()=>{
  console.log("Error in mongo session store",err);
})
const sessionOptions = { 
  store,
  secret : process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true }
  
  cookie: {
    expires :Date.now() + 7*24*60*60*1000,
    maxAge: 7*24*60*60*1000 , //
    httpOnly: true,              // client‐side JS can’t access
    secure: false                // set true if served over HTTPS
  }

  };
  app.use(session(
      sessionOptions
  ));
  app.use(flash());
  app.use(passport.initialize()); //initializes passport for every request so that we can do authentication 
  app.use(passport.session());
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser()); //storing user information into the session.
passport.deserializeUser(User.deserializeUser());
  // removing user information into the session
  





// app.get("/sampletesting",async(req,res)=>{
//   const listing1 = new Listing({
//     title:"My new villa",
//     description:"By the beach",
//     price:2000,
//     location:'Calangute,Goa',
//     country: "India"

//   });
//   await listing1.save();
//   console.log("sample was saved");
//   res.send("testing successful");

// })
app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.CurrUser = req.user;
  next();
});
// app.get("/",(req,res)=>{
//   res.send("hi i am root page");
// })

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);








app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"page not found") );

});

// app.use((err,req,res,next)=>{
//   console.log(err.name);
//   if(err.name == "TypeError"){
//       // console.log("This was a validation error.Please follow rules.")
//      throw new ExpressError(400,"Bad Request!");
//   }
//   next(err);
// })
app.use((err,req,res,next)=>{
  // res.send("something went wrong!");
  let {status=500,message="something went wrong!"} = err;
  // res.status(status).send(message);
  res.status(status).render("listings/error.ejs",{err});

})
app.listen(port,()=>{
  console.log(`app listening on port ${port}`);

});

