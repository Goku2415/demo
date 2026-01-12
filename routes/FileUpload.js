const express = require('express');
const  router = express.Router();
// const cloudinary = require('cloudinary').v2;

const {localFileUpload, imageUpload, videoUpload} = require('../controllers/fileUpload');


router.post('/localFileUpload', localFileUpload); 
router.post('/imageUpload', imageUpload);  
router.post('/videoUpload', videoUpload);  




module.exports = router; 

