import nodemailer from "nodemailer";

const sendEmail = async (toEmail, otp) => {

  // 1️⃣ Email server (Gmail) setup
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // your gmail
      pass: process.env.EMAIL_PASS  // gmail app password
    }
  });

  // 2️⃣ Email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "OTP Verification",
    text: `Your OTP is ${otp}. It is valid for 10 minutes.`
  };

  // 3️⃣ Send email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
