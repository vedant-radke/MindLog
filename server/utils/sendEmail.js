// utils/sendEmail.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // or use SMTP settings
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // your password or app password
  },
});

async function sendEmail(to, subject, html) {
  await transporter.sendMail({
    from: `"Journal App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

}

module.exports = sendEmail;
