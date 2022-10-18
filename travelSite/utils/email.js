const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
const pug = require('pug');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `JOHN DOE <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    //render html based on pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    //defien email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };
    // create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
};
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
