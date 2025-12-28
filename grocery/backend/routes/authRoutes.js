import express from 'express';
import { forgotPassword, login, registerUser, resendForgotOtp, resendOTP, resetPassword, verifyOTP } from '../controllers/authController.js';
import { otpLimiter } from '../utils/otpLimiter.js';

const router = express.Router();

//register user
router.post('/register',otpLimiter ,registerUser);
router.post('/verify-otp',otpLimiter,verifyOTP);
router.post('/resend-otp',otpLimiter,resendOTP);
router.post('/login',login);
router.post('/forgot-password',otpLimiter,forgotPassword);
router.post("/resend-forgot-otp", otpLimiter, resendForgotOtp);
router.post('/reset-password',otpLimiter, resetPassword);

export default router;