

const emailInfo = (user, otp)=>{
    return `

    <b>Dear ${user},</b>
    <br><br>
    Thank you for choosing <b>Amir Store</b>. To complete your verification process, please use the following One-Time Password (OTP):
    <br><br>
    Your OTP is: <b>${otp}</b>
    <br><br>
    This OTP is valid for the next <b>60</b> seconds. Please do not share this code with anyone. If you did not request this verification, please contact our support team immediately.
    <br><br>

    Thank you for your cooperation.
    <br><br>
    Best regards,<br><br>

    <b>Amir Azam<b><br>
    Sr. Software Engineer<br>
    Amir Store Pvt. Ltd<br>
    +91-9661272784<br>
     <a href = 'http://localhost:3000/signup'>http://localhost:3000/</a>
    `
}

module.exports = emailInfo