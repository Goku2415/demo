const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const SendmailTransport = require('nodemailer/lib/sendmail-transport');

const fileSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    imageUrl:{
        type:String,
        required:true,
    },
    tags:{
        type:[String],
    }, 
    email:{
        type:String,
    },
    
});



//code to send mail automatically to the user

fileSchema.post('save',async function(doc){
    try{
        console.log('DOC',doc);

        //transporter configuration
        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            port:587,

            auth:{
                user:process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        })

        let info = await transporter.sendMail({
            from:`<${process.env.MAIL_USER}>`,
            to: doc.email,
            subject:'new file uplaoded to cloudinary',
           html: `<h2>Hello jee kisan ba</h2>
                <p>
                    View here:
                    <a href="${doc.imageUrl}" target="_blank">
                    ${doc.imageUrl}
                    </a>
                </p>
                `,

        })

        console.log(info);


    }catch(err){
        
        console.error(err);
        
    }
})

const File = mongoose.model('File', fileSchema);
module.exports = File;

