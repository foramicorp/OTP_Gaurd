// IMPORTING REQUIREMENTS 
const mongoose = require("mongoose");

// DEFINING USER SCHEMA FOR MONGOOSE
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    otp: String,
    otpExpires: Date,
});

// USER MODEL FOR USE IN OTHER FILES
const User = mongoose.model("User", UserSchema);

// EXPORTING USER MODEL 
module.exports = User;
