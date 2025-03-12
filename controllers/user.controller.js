// IMPORTING REQUIREMENTS
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");
const generateOtp = require("../utils/generateOtp");
const User = require("../models/user.model");
const sendMail = require("../configs/mailer");
require("dotenv").config();


// USER SIGNUP CONTROLLER
const signup = async (req, res) => {
    const { name, email, password } = req.body;
    // CHECKING USER EXISTS
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        // HASHING PASSWORD
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// USER LOGIN CONTROLLER
const login = async (req, res) => {
    const { email, password } = req.body;
    // CHECKING USER EXISTS
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // COMPARING PASSWORDS
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // GENERATING JWT TOKEN
        const token = generateToken(user);
        res.json({ message: "Login successful", token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// FORGOT PASSWORD CONTROLLER 
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    // CHECKING USER EXISTS
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });
        
        // GENERATING OTP AND SENDING MAIL
        const otp = generateOtp(); // Use the generateOtp utility
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
        await user.save();

        await sendMail(email, "Password Reset OTP", `Your OTP is ${otp}. It expires in 10 minutes.`);

        res.json({ message: "OTP sent to your email" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// RESET PASSWORD CONTROLLER 
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    // CHECKING USER EXISTS AND OTP IS VALID
    try {
        const user = await User.findOne({ email, otp });
        if (!user || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // HASHING NEW PASSWORD
        user.password = await bcrypt.hash(newPassword, 10);
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// EXPORTING THE CONTROLLERS
module.exports = { signup, login, forgotPassword, resetPassword };
