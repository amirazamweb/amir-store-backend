


const orderMail = (buyer, orderNumber)=>{
    var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;

    return `
    <b>Dear ${buyer},</b>
    <br><br>
    Thank you for your recent purchase from <b>Amir Store</b>. We are pleased to confirm that your order has been successfully placed and is now being processed.
    <br><br>
    <b>Here are the details of your order:</b>
    <br>
      <p>Order Number : ${orderNumber}</p>
      <p>Date of Order : ${today}</p>
    <br>

    If you have any questions regarding your order, feel free to contact us.
    <br><br>
    Best regards,<br><br>

    <b>Amir Azam<b><br>
    Sr. Software Engineer<br>
    Amir Store Pvt. Ltd<br>
    +91-9661272784<br>
     <a href = 'http://localhost:3000/signup'>http://localhost:3000/</a>
    `
}

module.exports = orderMail