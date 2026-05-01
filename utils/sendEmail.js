import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // smtp.gmail.com
  port: Number(process.env.EMAIL_PORT), // 587
  secure: String(process.env.EMAIL_SECURE) === "true", // false
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async ({ to, subject, html, replyTo }) => {
  try {
    const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;
    const mailOptions = { from, to, subject, html };
    if (replyTo) mailOptions.replyTo = replyTo;

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);

    return info;
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error;
  }
};