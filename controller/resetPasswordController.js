const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
const fs = require('fs'); 
const resetPasswordOTP = require('../helpers/generateOTPResetPassword');
const UserModel  = require('../models/userModel');
const {hashedPassword} = require('../helpers/authHelper');

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, 
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD
  },
});


// check registered user
const resetPasswordOTPController = async(req, res)=>{
    try {
     const {email, generateOTP} = req.body;
         
         const user = await UserModel.findOne({email}).select({password:0, profileImg:0});
         if (!user) {
           return res.send({
               success: false,
               message: 'Email is not registered'
           })
         }

        //  send otp
        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject: "OTP for Reset Password",
            html: resetPasswordOTP(generateOTP)
          }
          
           const info = await transporter.sendMail(mailOptions);

          const userOtp = await UserModel.findOneAndUpdate({email}, {code:generateOTP}, {new:true}).select({profileImg:0, password:0});

           res.send({
            success:true,
            message: 'OTP has been sent to your email'
           })    

    } catch (error) {
      res.send({
        success:false,
        message: "Error checking registered user"
      });
     console.log(error);
    }
 }


//  reset password
const resetPasswordController = async(req, res)=>{
  try {
    const {otp, email, password} = req.body;
    
    // check otp
    const userCode = await UserModel.findOne({email}).select({profileImg:0});
    if(userCode.code!=otp){
      return res.send({
        success:false,
        message : 'Wrong OTP'
      })
    }

    // update new password
    const updatedUser = await UserModel.updateOne({email}, {password:hashedPassword(password), code:0}).select({profileImg:0});

    res.send({
      success:true,
      message : "Password reset successfully"
    })

  } catch (error) {
    res.send({
      success:false,
      message: "Error while reset password"
    });
     console.log(error);
  }
}
 


 module.exports = {resetPasswordOTPController, resetPasswordController}