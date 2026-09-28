const config = require('../config/config')
//const axios = require('axios')

const generateBody = (name,otp)=>{
    return `
Dear ${name},

To ensure the security of your account, we have generated a One-Time Password (OTP) for your recent access request. Please use the OTP below to complete your verification process.
    
Your OTP is: ${otp}
    
This OTP is valid for the next 10 minutes. Please do not share this OTP with anyone. If you did not request this OTP, please contact our support team immediately.
    
Thank you for using our services. We are committed to keeping your account secure.
    
Best regards,
To Pay Support Team
    
    
Company Contact Information`;
}
const subject = "To Pay - One-Time Password (OTP) for Account Verification";
function findPageSize(req) {
    let pageSize;
    if (req.query.limit) {
        if ((parseInt(req.query.limit)) > config.admin.maxPageLimit) {
            pageSize = config.admin.maxPageLimit;
        } else {
            pageSize = parseInt(req.query.limit);
        }
    } else {
        pageSize = config.admin.pageSize;
    }
    return pageSize;
}

async function generateOtpAndSend(recipient){
    try {
        // generate random 6-digit OTP
        let randNumber = Math.floor(100000 + Math.random() * 900000);
        
        // API implementation of send OTP
        let url = config.msg91.baseURL+"/otp?"+
        "template_id="+config.msg91.templets.otp+
        "&mobile="+recipient+
        "&authkey="+config.msg91.authKey+
        "&realTimeResponse=1&otp="+randNumber;

        let res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return {
            randNumber,
            ...res.data
        };
    } catch (err) {
        console.log(err);
        return {
            error: err.message
        };
    }
}
function pagination(req){
    let limit = parseInt(req.query.limit) || config.pagination.limit;
    let page = parseInt(req.query.page) || 1;
    let skip = (page - 1) * limit;
    return { limit, skip };
}
function capitalizeFirstLetter(str) {
    if (!str || typeof str !== "string") return str; // Handle non-string inputs
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
  
  
module.exports = {
    findPageSize,
    generateOtpAndSend,
    pagination,
    capitalizeFirstLetter,
}
