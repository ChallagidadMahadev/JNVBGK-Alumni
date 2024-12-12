import crypto from "crypto";

// In-memory OTP storage (for development)
const otpStore = new Map();

const OTP_EXPIRY = 15 * 60 * 1000; // 15 minutes in milliseconds

export const generateOTP = async (userId) => {
  // Generate 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  // Store OTP with expiry
  otpStore.set(userId.toString(), {
    otp,
    expiresAt: Date.now() + OTP_EXPIRY,
  });

  return otp;
};

export const verifyOTP = async (userId, providedOTP) => {
  const storedData = otpStore.get(userId.toString());

  if (!storedData) {
    return false;
  }

  if (Date.now() > storedData.expiresAt) {
    otpStore.delete(userId.toString());
    return false;
  }

  if (storedData.otp !== providedOTP) {
    return false;
  }

  // Delete OTP after successful verification
  otpStore.delete(userId.toString());
  return true;
};

// Cleanup expired OTPs periodically
setInterval(() => {
  for (const [userId, data] of otpStore.entries()) {
    if (Date.now() > data.expiresAt) {
      otpStore.delete(userId);
    }
  }
}, 60000); // Clean up every minute
