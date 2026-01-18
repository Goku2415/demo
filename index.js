const express = require('express');
const fileUpload = require("express-fileupload");

const app = express();

app.use(express.json());

require('dotenv').config();
const PORT = process.env.PORT || 3000;



app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

const db = require('./config/database');
db.connect();

const cloudinary = require('./config/cloudinary');
cloudinary.cloudinaryConnect();


//api route mounting 
const Upload = require('./routes/FileUpload');
app.use('/api/v1/upload', Upload);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 