const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userImage: { type: String, default: null },
    email: { type: String, default: null}, 
    phoneNo: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    otp: { 
        isOtpVerified: { type: Boolean, default: false },
        otp: { type: Number, default: null } ,
    },
    role: { type: String, enum: ['bloger','admin'], required: true ,message: 'Invalid role' },
    isVerified:{type: Boolean, default: false},
    createdAt: { type: Date, default: Date.now }
});


const User = mongoose.model('User', userSchema);

module.exports = User;
