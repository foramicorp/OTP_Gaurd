// IMPORTING REQUIREMENTS
const mongoose = require("mongoose");
require("dotenv").config();

// CONNECTION FUNCTION TO MONGODB DATABASE
const dbConnect = async () => {
    await mongoose.connect(process.env.DB_URL);
    console.log("connected to database");
}

// EXPORTING THE CONNECTION FUNCTION
module.exports = dbConnect;