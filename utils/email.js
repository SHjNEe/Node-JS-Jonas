const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Trung Nguyen Natours <${process.env.EMAIL_FROM}`;
  }
  newTransport() {
    if (process.env.NODE_ENV === "production") {
      return 1;
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
    // 1) RENDER HTML based on pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    //2 Define email popOptions
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: htmlToText.fromString(html),
      html,
    };
    await this.newTransport().sendMail(mailOptions);
  }
  async sendWelcome() {
    await this.send("welcome", "Welcome to the Natours Family !");
  }
  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your password reset token (valid for only 10 minutes)"
    );
  }
};

// const sendEmail = async (options) => {
//   // Create trasnporter
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.GMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//     // Active in gmail "less secure app" options
//   });
//   // Define the email options
//   const mailOptions = {
//     from: "Trung Nguyen Natours",
//     to: options.email,
//     subject: options.subject,
//     text: options.text,
//     // html:
//   };
//   // Send the email with nodemailer
//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;
