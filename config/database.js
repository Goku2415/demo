const mongoose = require('mongoose');

require('dotenv').config();

exports.connect = async () => {
    await mongoose.connect(process.env.MONGODB_URL)

    .then(console.log("DB connection is successful"))
    .catch((err) => {
        console.log("DB connection failed");
        console.log(err);
        process.exit(1);
    });
}