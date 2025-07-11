const nodemailer = require('nodemailer');

export const sendEmail = (options: {
  email: string;
  subject: string;
  message: string;
}) => {
  //1) creatte a transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  //2) Define the email options
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: 'eslamalaa532@gmail.com',
    subject: options.subject,
    text: options.message,
    // html: '<h1>Welcome to Natours</h1>', // if you want to send HTML content
  };
  //3) Actually send the email
  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) {
      return console.log('SOMETHING WRONG', error);
    }
    console.log('Email sent: ' + info.response);
  });
};
