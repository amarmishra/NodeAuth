const nodemailer = require('nodemailer');
const email=process.env.GMAIL
const password=process.env.GMAIL_PASSWORD

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email,
    pass: password,
  }
});

function sendMailService(receiverMail,link){

    const mailOptions = {
        from: email,
        to: receiverMail,
        subject: 'Reset password for node-auth app',
            html: `<h1>Hi</h1><p>Click on the link below to reset password</p>${link}`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
}

module.exports={sendMailService}
