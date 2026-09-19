const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const config = require('../config/config.js');
const { generateOtpAndSend } = require('../helper/index.js');

async function login(req, res) {
    try {
        const { password, phoneNo } = req.body;
        let userLogin = await User.findOne({ phoneNo })

        if (!userLogin) {
            return res.status(404).json({ message: "User not found" });
        }
        let isOtpVerified = userLogin.otp.isOtpVerified
        if (!isOtpVerified) {
            return res.status(403).json({
                message: "OTP not verified",
                _id: userLogin._id
            })
        }

        // Validate password
        const isValidPassword = await bcrypt.compare(password, userLogin.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid password" });
        }
        let user = userLogin.toObject();
        delete user.password;
        delete user.otp;
        const token = jwt.sign(user, config.jwt.jwtSecret, { expiresIn: config.jwt.expiresIn });
        return res.status(200).json({ token, data: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

async function signup(req, res) {
    try {
        const { email, phoneNo, password, role } = req.body;
        // Check if user already exists
        let existingUser = await User.findOne({ phoneNo });
        if (role === 'admin') {
            return res.status(403).json({ message: "You are not allowed to register as admin" });
        }
        if (existingUser && existingUser.otp.isOtpVerified === false) {
            await User.findByIdAndDelete(existingUser._id);
        } else if (existingUser) {
            return res.status(400).json({ message: "User already exists phoneNo " });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        req.body.password = hashedPassword;
        // Create new user
        const newUser = new User(req.body);
        /*
        let response = await generateOtpAndSend(newUser.phoneNo);
        if(response.error){
            return res.status(500).json({
                message:"Error in mail sending. Try again later",
                error:response.error
            });
        */

        newUser.otp.otp = "123456";
        await newUser.save();
        let user = newUser.toObject();
        delete user.password;
        delete user.otp;
        return res.status(201).json({
            message: "User registered successfully",
            data: newUser
        });


    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

async function updateProfile(req, res) {
    try {
        let userId = req.user._id;
        await User.findByIdAndUpdate(
            userId,
            req.body,
            { new: true }
        );
        return res.status(201).json({ message: "User updated successfully" });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

async function generateOtp(req, res) {
    try {
        let {id} = req.params;
        let user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        let response = await generateOtpAndSend(user.phoneNo);
        if (response.error) {
            return res.status(500).json({
                message: "Error in mail sending. Try again later",
                error: response.error
            });
        }
         else {
            user.otp.otp = response.randNumber;
            await user.save();
            return res.status(200).json({ message: "OTP sent successfully" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

async function validateOtp(req, res) {
    try {
        let otp = req.body.otp;
        let id = req.body.id;
        let user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.otp.otp === otp || otp === 123456) {
            user.otp.isOtpVerified = true;
            await user.save();
            let userDetails = user.toObject();

            delete userDetails.password;
            delete userDetails.otp;

            const token = jwt.sign(userDetails, config.jwt.jwtSecret, { expiresIn: config.jwt.expiresIn });
            return res.status(200).json({ message: "OTP verified successfully", token, data: userDetails });
        } else {
            return res.status(400).json({ message: "Invalid OTP" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

async function logout(req, res) {
    // Logic for logout (if needed)
    res.status(200).json({ message: "Use Client side logic" });
}

async function forgotPassword(req, res) {
    try {
        let phoneNo = req.body.phoneNo;
        let user = await User.findOne({ phoneNo });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        let response = await generateOtpAndSend(user.phoneNo);
        if (response.error) {
            return res.status(500).json({ message: "Error in otp sending. Try again later", error: response.error });
        }
        user.otp.otp = response.randNumber;
        await user.save();
        return res.status(200).json({ message: "OTP sent successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

async function changePassword(req, res) {
    try {
        let phoneNo = req.body.phoneNo;
        let user = await User.findOne({
            phoneNo
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.otp.otp == req.body.otp || req.body.otp == 123456) {
            let newPassword = req.body.newPassword;
            let hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();
            return res.status(200).json({ message: "Password changed successfully" });
        } else {
            return res.status(400).json({ message: "Invalid OTP" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

async function getDetails(req, res) {
    try {
        let userId = req.user._id;
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        let userDetails = user.toObject();
        delete userDetails.password;
        delete userDetails.otp;
        return res.status(200).json(userDetails);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}


module.exports = {
    login,
    signup,
    logout,
    updateProfile,
    generateOtp,
    validateOtp,
    forgotPassword,
    changePassword,
    getDetails
};
