import nodemailer from "nodemailer";



const sendEmail = async ({ email, subject, resetUrl }) => {
console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "Not Loaded");



  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html: `
      <h2>Reset Password</h2>
      <p>Click below:</p>
      <a href="${resetUrl}">${resetUrl}</a>
    `,
  });
};

export default sendEmail;