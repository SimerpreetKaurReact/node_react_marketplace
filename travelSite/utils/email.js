const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //1) create a transporter
  //   host: "smtp.mailtrap.io",
  //   port: 2525,
  //   auth: {
  //     user: "5d6e682ee0b2ea",
  //     pass: "5a09f31676bd1f"
  //   }
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_DEV_HOST,
    port: process.env.EMAIL_DEV_PORT,
    //avoid using gmail because of its limitations
    //activate in gmail "less secure app" option if you have to use it
    auth: {
      user: process.env.EMAIL_DEV_USERNAME,
      pass: process.env.EMAIL_DEV_PASSWORD,
    },
  });

  // 2) define the email options
  const mailOptions = {
    from: 'JOHN DOE <hello@john.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html
  };
  console.log(transporter, mailOptions);
  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
