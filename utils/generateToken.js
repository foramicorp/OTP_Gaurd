// IMPORTING REQUIREMENTS
const jwt = require("jsonwebtoken");
require("dotenv").config();

// FUNCTION TO GENERATE JWT TOKEN
const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// EXPORTING THE FUNCTION
module.exports = generateToken;
