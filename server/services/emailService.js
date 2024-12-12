import nodemailer from "nodemailer";

let transporter;

// Initialize email transporter
const initializeTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn("Email configuration missing. Email services will not work.");
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

export const sendOTPEmail = async (email, otp) => {
  if (!transporter) {
    transporter = initializeTransporter();
    if (!transporter) {
      console.error("Email service not configured");
      throw new Error("Email service not available");
    }
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Password Reset Request</h2>
        <p>Your OTP for password reset is:</p>
        <h1 style="color: #1e40af; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
        <p>This OTP will expire in 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Failed to send OTP email");
  }
};
