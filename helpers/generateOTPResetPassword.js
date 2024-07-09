

const resetPasswordOTP = (otp)=>{
    return `
    Dear,
    <br><br>
    You recently requested to reset your password. Here is your One-Time Password (OTP):
    <br><br>
    Your OTP is: <b>${otp}</b>
    <br><br>
    Please enter this OTP on the reset password page to verify your identity and create a new password.
    <br><br>

    Thank you,<br>
    Amir Store Pvt. Ltd
    `
}

module.exports = resetPasswordOTP