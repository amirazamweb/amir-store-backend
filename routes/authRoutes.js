const express = require('express');
const formidable = require('express-formidable');
const {signupOTPController, signupController, loginController, profileImageController, allUsersController, updateRoleController, allUserCountController, allUsersByPaginationController, updateProfileController} = require('../controller/authController');
const {resetPasswordOTPController, resetPasswordController} = require('../controller/resetPasswordController');
const {isLogin, isAdmin} = require('../middlewares/authMiddleware');

 const router = express.Router();


//signup otp || POST
router.post('/signup-otp', signupOTPController);

//  signup || POST
router.post('/signup', formidable(), signupController);

// login || POST
router.post('/login', loginController);

// profile img
router.get('/profile-img/:id', profileImageController);

// user protected route
router.post('/user', isLogin, (req, res) => {
    res.send({ ok: true })
});

// admin protected route
router.post('/admin', isLogin, isAdmin, (req, res) => {
    res.send({ ok: true })
});

// all users
router.get('/all-users/:uid', allUsersController);

// change user role
router.post('/update-user/:id', updateRoleController)

// all users count
router.post('/all-user-count/:uid', allUserCountController)

// all users by pagination
router.post('/all-users/:uid/:page', allUsersByPaginationController);

// otp for reset password
router.post('/reset-password-otp', resetPasswordOTPController);

// reset password
router.post('/reset-password', resetPasswordController);

// update profile info
router.post('/update-profile', formidable(), updateProfileController)


 module.exports = router;