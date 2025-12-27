import express from 'express';
import { forgotPassword, login, registerUser, resetPassword, verifyOTP } from '../controllers/authController.js';

const router = express.Router();

//register user
router.post('/register', registerUser);
router.post('/verify-OTP',verifyOTP);
router.post('/login',login);
router.post('/forgot-password',forgotPassword);
router.post('/reset-password', resetPassword);

export default router;