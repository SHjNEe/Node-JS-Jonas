const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // Create trasnporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // Active in gmail "less secure app" options
  });
  // Define the email options
  const mailOptions = {
    from: "Trung Nguyen Natours",
    to: options.email,
    subject: options.subject,
    text: options.text,
    // html:
  };
  // Send the email with nodemailer
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
