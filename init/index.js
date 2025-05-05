const mongoose = require('mongoose');
const Listing = require("../models/listing");
const initdata = require("./data"); 
main()
.then((result)=>{
    console.log("connection successful");
})
.catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}
 const initdb = async()=>{
  initdata.data = initdata.data.map((obj)=>{
    return obj = {...obj,owner : "6804fc7c8f6a0a3fea063ea9"}
  })
  
  await Listing.deleteMany({});
  await Listing.insertMany(initdata.data); //initdata is an object so accessing data from that.
  console.log("data initialized");

 }
 initdb();
 