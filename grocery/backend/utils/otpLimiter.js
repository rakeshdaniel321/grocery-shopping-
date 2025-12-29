import rateLimit from "express-rate-limit";

export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // max 5 requests per IP
  message: {
    message: "Too many OTP requests. Try again later."
  }
});
