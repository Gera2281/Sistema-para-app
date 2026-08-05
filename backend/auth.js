const nodemailer = require('nodemailer');

function sendPasswordResetEmail(email, token) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-password'
    }
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Password Reset',
    text: `Click the following link to reset your password: http://localhost:4200/reset-password/${token}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = {
  sendPasswordResetEmail
};
