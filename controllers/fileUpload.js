const File = require('../models/File');
const cloudinary = require('cloudinary').v2;


exports.localFileUpload = async (req, res) => {
    try {
        const file = req.files.file; //syntax to fetch file from req.files object
        console.log("lo file aa gai",file);


        //creataed a path where file need to be stored on server
        // "__dirname" is a global variable in nodejs that gives the current directory path of the file being executed
        
        let path = __dirname+"/files/"+Date.now() +`.${file.name.split('.')[1]} `;
        //.${file.name.split('.')[1]} this is used to get the extension of the file, which we gets form file variable and we split the file into two parts based on the ("." dot) such that the late part of the split is the extension of the file dynamically like .png, .jpg etc.



        file.mv(path, (err)=>{
            console.log(err)
        }) //mv is a method in express to move file to a given path that we provide, in this case we want to move it to cloudinary

        res.json({
            success:true,
            message:"File uploaded successfully to local storage",
        })
        
    } catch (error) {
        console.log("Error in local file upload controller", error);
        res.status(500).json({
            success:false,
            message:"Something went wrong in local file upload",
        });

    }
};


function isFileTypeSupported(fileType, supportedTypes){
    return supportedTypes.includes(fileType);
}


async function uploadFileToCloudinary(file, folder, quality ){
    const options = {folder};
    options.resource_type ='auto';
    console.log( 'temp file path', file.tempFilePath);
    if(quality){
        options.quality = quality;
    } 
    return await cloudinary.uploader.upload(file.tempFilePath,options);
}




exports.imageUpload = async (req, res) => {
    try{
        const {name,tags, email} = req.body;
        console.log(name,tags, email);

        const file = req.files.imageFile;
        console.log("image file", file);

        const supportedTypes = ['jpg', 'png', 'jpeg'];
        const fileType = file.name.split('.')[1].toLowerCase();

    
        if(!supportedTypes.includes(fileType)){
            return res.status(400).json({
                success:false,
                message:"File type not supported. Only jpg, png and jpeg are allowed.",
            });
        }

        const response = await uploadFileToCloudinary(file,"codehelp");
        console.log("response from cloudinary", response);


        //store file info in database
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url,
            
        })

        res.json({
            success:true,
            imageUrl: response.secure_url,
            message:"Image uploaded successfully to cloudinary",
            
        })

    }catch(err){
        console.error("Error in image upload controller", err);
        res.status(500).json({
            success:false,
            message:"Something went wrong in image upload",
        });
    }
};

const maxFileSize = 5*1024*1024;


exports.videoUpload = async (req, res) => {
    try{
        const {name,tags, email} = req.body;
        console.log(name,tags, email);

        const file = req.files.videoFile;
        console.log("video file", file);


        // if (file.size > maxFileSize) {
        //     return res.status(400).json({
        //     success: false,
        //     message: "File size exceeds 5MB limit",
        //     });
        // }


        const supportedTypes = ['mp4', 'mov', 'wmv', 'avi', 'mkv'];
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log('fileType', fileType);


        if(!isFileTypeSupported(fileType, supportedTypes)){
            return res.status(400).json({
                success:false,
                message:"File type not supported. Only mp4, mov, wmv, avi and mkv are allowed.",
            });
        }

        const response = await uploadFileToCloudinary(file,'codeHelpVideos');
        console.log(response);

        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url,
        })

        res.json({
            success:true,
            imageUrl: response.secure_url,
            message:"video uploaded successfully to cloudinary",
            
        })



    }catch(err){
        console.error("Error in video upload controller", err);
        res.status(500).json({
            success:false,
            message:"Something went wrong in video upload",
        });
    }
}; 






exports.imageSizeReducer = async (req, res) => {
    try{
         const {name,tags, email} = req.body;
        console.log(name,tags, email);

        if (!req.files || !req.files.imageFile) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded",
      });
    }

        const file = req.files.imageFile;
        console.log("image file", file);

        const supportedTypes = ['jpg', 'png', 'jpeg'];
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log("file type:", fileType);

    
        if(!isFileTypeSupported(fileType,supportedTypes)){
            return res.status(400).json({
                success:false,
                message:"File type not supported. Only jpg, png and jpeg are allowed.",
            });
        }

        const response = await uploadFileToCloudinary(file,"codehelp",30);
        console.log("response from cloudinary", response);


        //store file info in database
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url,
            
        })

        res.json({
            success:true,
            imageUrl: response.secure_url,
            message:"Image uploaded successfully to cloudinary",
            
        })



    }catch(err){
        res.status(500).json({ 
            success: false, 
            message: "Something went wrong in image size reducer" 
        });
        console.log(err);
    }
};