const nodemailer = require('nodemailer');
let config = require('../config');
let jwt = require('jsonwebtoken');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'campus.gruv.2020@gmail.com',
    pass: 'C@mpu$Gru0'
  }
});

module.exports = function sendPasswordResetEmail(userEmail, token) {
    const url = `${config.apiBaseUrl}/reset/${token}`;

    const mail = {
        from: 'campus.gruv.2020@gmail.com',
        to: userEmail,
        subject: 'Reset your password for CampusGruv app',
        html: `
            Hello, <br><br>
            Follow this link to reset your CampusGruv password for your ${userEmail} account. <br><br>
            <a href="${url}">${url}</a> <br><br>
            If you didn’t ask to reset your password, you can ignore this email. <br><br>
            Thanks, <br><br>
            Your CampusGruv team`
  };
  
  transporter.sendMail(mail, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${  info.response}`);
    }
  });
}