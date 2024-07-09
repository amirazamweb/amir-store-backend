
const updateOrderStatusEmail = (buyer, orderNumber, orderDate, orderStatus)=>{
    if(orderStatus=='Cancelled'){
    return `
    <b>Dear ${buyer},</b>
    <br><br>
    I hope this message finds you well. I regret to inform you that your order with us, Order Number ${orderNumber}, has been cancelled.
    <br><br>

    <b>Reason for Cancellation:</b>
    <p>Your product has been cancelled due to unforeseen stock issue</p>  

    <b>Here are the cancelled order:</b>
    <br>
      <p>Order Number : ${orderNumber}</p>
      <p>Date of Order : ${orderDate}</p>

    <b>Refund Information:</b>
    <br>
    <p>Any payments made for this order have been refunded to the original method of payment. Please allow 7 days for the refund to reflect in your account.</p>
    <p>If you have any questions or concerns about the cancellation or refund process, please do not hesitate to contact us. We apologize for any inconvenience this cancellation may have caused.</p>
    <p>Thank you for your understanding in this matter. We value your patronage and hope to serve you again in the future.</p>

    <br>
    Best regards,<br><br>

    <b>Amir Azam<b><br>
    Sr. Software Engineer<br>
    Amir Store Pvt. Ltd<br>
    +91-9661272784<br>
     <a href = 'http://localhost:3000/signup'>http://localhost:3000/</a>
    `
    }
    else{
    return `
    <b>Dear ${buyer},</b>
    <br><br>
    I hope this message finds you well. I am writing to provide you with an update on the status of your recent order with us.
    <br><br>
    <b>Here are the details of your order:</b>
    <br>
      <p>Order Number : ${orderNumber}</p>
      <p>Date of Order : ${orderDate}</p>

    <p><b>Current Status</b> : ${orderStatus}</p>

    <p>Thank you for choosing <b>Amir Store</b>. We appreciate your business and look forward to serving you again.</p>

    <br>
    Best regards,<br><br>

    <b>Amir Azam<b><br>
    Sr. Software Engineer<br>
    Amir Store Pvt. Ltd<br>
    +91-9661272784<br>
     <a href = 'http://localhost:3000/signup'>http://localhost:3000/</a>
    `
    }
}


module.exports = updateOrderStatusEmail;