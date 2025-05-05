const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
    
})
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'WanderLust_Dev',
    //   format: async (req, file) => 'png', // supports promises as well
    allowedFormats:['png','jpg','jpeg','WEBP','WEBP File'],
    },
  });
  module.exports = {
    cloudinary,
    storage
  }