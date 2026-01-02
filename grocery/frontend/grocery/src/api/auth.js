import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:7000/api/auth" });

export const registerUser = (data) => API.post("/register", data);
export const verifyOtp = (data) => API.post("/verify-otp", data);
export const loginUser = (data) => API.post("/login", data);
export const forgotPassword = (data) => API.post("/forgot-password", data);
export const resendForgotOtp = (data) => API.post("/resend-forgot-otp", data);
export const resetPassword = (data) => API.post("/reset-password", data);

