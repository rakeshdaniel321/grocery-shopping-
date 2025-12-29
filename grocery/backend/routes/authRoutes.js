import express from 'express';
import { forgotPassword, login, registerUser, resendForgotOtp, resendOTP, resetPassword, verifyOTP } from '../controllers/authController.js';
import { otpLimiter } from '../utils/otpLimiter.js';
import { protect,isAdmin } from '../middleware/authMiddleware.js';
const router = express.Router();

//register user
router.post('/register',otpLimiter ,registerUser);
router.post('/verify-otp',otpLimiter,verifyOTP);
router.post('/resend-otp',otpLimiter,resendOTP);
router.post('/login',login);
router.post('/forgot-password',otpLimiter,forgotPassword);
router.post("/resend-forgot-otp", otpLimiter, resendForgotOtp);
router.post('/reset-password', resetPassword);


// login system role bassed 

router.get("/admin/dashboard",protect,isAdmin,(req,res)=>{res.status(200).json({message:"wlecome admin dashboaerd"})})
router.get("/user/profile",protect,(req,res)=>{res.status(201).json({messsage:"user Profile",userId:req.user._id})})

export default router;