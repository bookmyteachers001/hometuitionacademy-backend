require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const readline = require('readline');
const User = require('../models/User');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q, fallback) =>
    new Promise((resolve) => rl.question(q, (answer) => resolve(answer.trim() || fallback)));

async function main() {
    if (!process.env.MONGODB_CONNECTION_STRING) {
        console.error('MONGODB_CONNECTION_STRING is missing from .env');
        process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    console.log('Connected to MongoDB.\n');

    // Defaults match the demo credentials already hardcoded into the
    // dashboard's login form (signin.jsx) so you can log in immediately
    // without editing any frontend code. Change them later for real use.
    const phoneNo = await ask('Admin phone number [8210925188]: ', '8210925188');
    const password = await ask('Admin password [12345]: ', '12345');
    const fullName = await ask('Admin full name [Admin]: ', 'Admin');

    const hashedPassword = await bcrypt.hash(password, 10);

    const existing = await User.findOne({ phoneNo });
    if (existing) {
        existing.password = hashedPassword;
        existing.fullName = fullName;
        existing.role = 'admin';
        existing.otp.isOtpVerified = true;
        existing.isVerified = true;
        await existing.save();
        console.log(`\nUpdated existing user to admin: ${phoneNo}`);
    } else {
        await User.create({
            phoneNo,
            password: hashedPassword,
            fullName,
            role: 'admin',
            isVerified: true,
            otp: { isOtpVerified: true, otp: null },
        });
        console.log(`\nCreated new admin user: ${phoneNo}`);
    }

    console.log('You can now log in to the dashboard with this phone number and password.');
    rl.close();
    await mongoose.connection.close();
    process.exit(0);
}

main().catch((error) => {
    console.error('Seeding admin failed:', error);
    process.exit(1);
});
