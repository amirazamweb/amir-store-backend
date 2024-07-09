const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
const fs = require('fs'); 
const emailInfo = require('../helpers/generateOtpEmail');
const UserModel  = require('../models/userModel');
const {hashedPassword, comparePassword, createToken} = require('../helpers/authHelper');

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


// signupOTPController
const signupOTPController = async(req, res)=>{
   try {
    const {name, email, generateOTP} = req.body;
        
        const user = await UserModel.findOne({email}).select({password:0, profileImg:0});
        if (user) {
          return res.send({
              success: false,
              message: 'Email is already registered'
          })
        }

        // send otp
        const mailOptions = {
          from: process.env.SMTP_MAIL,
          to: email,
          subject: "Your One-Time Password (OTP) for Verification",
          html: emailInfo(name, generateOTP)
        }
        
         const info = await transporter.sendMail(mailOptions);

         res.send({
          success:true,
          message:'OTP has been sent to your email!'
         })

   } catch (error) {
    res.send("Error checking new user");
    console.log(error);
   }
}


// signup
const signupController = async(req, res)=>{
    try {
      const {name, email, password} = req.fields;
      const {profileImg} = req.files;
        //save new user
        const newUser = new UserModel({name, email, password:hashedPassword(password)});
        if(profileImg){
          newUser.profileImg.data = fs.readFileSync(profileImg.path);
          newUser.profileImg.contentType = profileImg.type;
        }

        newUser.save();

        res.send({
          success: true,
          message: 'User registered successfully'
      })


    } catch (error) {
      console.log(error);
      res.send({
          success: false,
          message: 'Error while registering user'
      })
    }
}


// login
const loginController = async(req, res)=>{
         try {
          const {email, password} = req.body;
          const user = await UserModel.findOne({email}).select({profileImg:0});
          
          // checking valid user
          if(!user){
            return res.status(200).send({
              success: false,
                message: 'Not a valid user'
            })
          }

          // checking password
          if(!comparePassword(password, user.password)){
            return res.send({
              success: false,
              message: 'Not a valid credentials'
          })
          }

          // create token
           const token = createToken(user._id);
           res.send({
           success: true,
           message: 'Login successfully',
           user: { name: user.name, email: user.email, _id: user._id, role: user.role },
           token
          })     
         } catch (error) {
          res.send({
            success: false,
            message: 'Error while login user'
        })
         }
}

// profile image
const profileImageController = async(req, res)=>{
  try {
    const user = await UserModel.findById(req.params.id).select({profileImg:1});
    res.set('Content-type', user?.profileImg.contentType);
    res.send(user?.profileImg.data)
  } catch (error) {
    res.send({
      success: false,
      message: 'Error while getting user image'
  })
  console.log(error);
  }
}

// all users
const allUsersController = async(req, res)=>{
  try {
    const users = await UserModel.find({_id:{$nin:[req.params.uid]}}).select({profileImg:0, password:0, code:0}).sort({ createdAt: -1 });
    res.json(users)
  } catch (error) {
    res.send({
      success: false,
      message: 'Error while getting all users'
  })
  console.log(error);
  }
}

// updateUserController
const updateRoleController = async(req, res)=>{
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, req.body, {new:true}).select({password:0, profileImg:0});
    res.send({
      success:true,
      message: 'User role updated successfully!'
    })
  } catch (error) {
    res.send({
      success:false,
      message: 'Something went wrong!'
    })
    console.log(error);
  }
}

// userCountController
const allUserCountController = async(req, res)=>{
  try {
    const users = await UserModel.find({_id:{$nin:[req.params.uid]}}).select({profileImg:0, password:0, code:0});
    res.send({
      success:true,
      userCount:users.length
    })
  } catch (error) {
    res.send({
      success:false,
      message: 'Error while getting all user count!'
    })
    console.log(error);
  }
}

// allUsersByPaginationController
const allUsersByPaginationController = async(req, res)=>{
  try {
    const {uid, page} = req.params;
    const numberOfSkipUsers = (page-1)*19;

    const users = await UserModel.find({_id:{$nin:[uid]}}).select({profileImg:0, password:0, code:0}).sort({createdAt:-1}).skip(numberOfSkipUsers).limit(19);

    res.send({
      success:true,
      message:'All users by pagination number',
      users
    })
    
  } catch (error) {
    res.send({
      success:false,
      message: 'Error while getting all users by pagination!'
    })
    console.log(error);
  }
}

// updateProfileController
const updateProfileController = async(req, res)=>{
     try {
      const {name, email} = req.fields;
      const {profileImg} = req.files;

      if(profileImg){
        const bufferData = fs.readFileSync(profileImg.path);
        const updatedUser = await UserModel.findOneAndUpdate({email}, {profileImg:{data:bufferData, contentType: profileImg.type}, name}, {returnOriginal:false}).select({profileImg:0});
        res.send({
          success: true,
          message: 'Profile updated successfully',
          updatedUser
        })
      }
      else{
        const updatedUser = await UserModel.findOneAndUpdate({email}, {name}, {returnOriginal:false}).select({profileImg:0});
        res.send({
          success: true,
          message: 'Profile updated successfully',
          updatedUser
        })
      }
     } catch (error) {
      res.send({
        success:false,
        message: 'Error while updating the profile'
      })
      console.log(error);
     }
}

module.exports = {signupOTPController, signupController, loginController, profileImageController, allUsersController, updateRoleController, allUserCountController, allUsersByPaginationController, updateProfileController};