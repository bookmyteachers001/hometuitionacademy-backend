const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../middleware/authMiddleware');

const authController = require('../controllers/auth');

router.post('/register',authController.signup);
router.post('/login',authController.login); 
router.post('/sendOTP/:id',authController.generateOtp);
router.post('/verifyOTP',authController.validateOtp);
router.post('/forgotPassword',authController.forgotPassword);
router.post('/changePassword',authController.changePassword);
router.post('/updateProfile',authenticateToken,authController.updateProfile);
router.get('/details',authenticateToken,authController.getDetails);
module.exports = router;
