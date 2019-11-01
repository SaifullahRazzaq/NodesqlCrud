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

module.exports = function sendSignupMail(userEmail, userName, userId) {
    const emailToken =  jwt.sign(
                        {
                            userId: userId
                        },
                        config.secret,
                        { 
                            expiresIn: '24h' // expires in 24 hours
                        }
                    );

    const url = `${config.apiBaseUrl}/verify/${emailToken}`;

    const mail = {
        from: 'campus.gruv.2020@gmail.com',
        to: userEmail,
        subject: 'Verify your email for CampusGruv app',
        html: `
            Hello ${userName}, <br><br>
            Follow this link to verify your email address. <br><br>
            <a href="${url}">${url}</a> <br><br>
            If you didn’t ask to verify this address, you can ignore this email. <br><br>
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