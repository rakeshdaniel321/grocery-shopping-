import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { isStrongPassword } from '../utils/erorrHandling.js';
import { generateOTP } from '../utils/generateOTP.js';
import sendEmail from '../utils/sendEmail.js';

export const registerUser = async (req, res)=>
{
    try {
        const { name, email, password } = req.body;

        // validation
        if(!name || !email || !password) {
            return res.status(400).json({ message:"All filds are required"});
        }

         const isPasswordStrong = await isStrongPassword(password);
        //check storng password cheack 

         if (!isPasswordStrong) {
            return res.status(400).json({ message: " Storng Password weak Min 8 characters one number one symbol Upper + lower case"});
         }


         // check if user already exists user aalready irukka login pannungala 

         const existsUser = await User.findOne({ email });

         if(existsUser) {
            return res.status(409).json({ message: "User already exists. Please login"});
         }

            //hash password password hash panrathu 

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            //otp 
            const otp = generateOTP();

           //console.log("Generated OTP:", otp);

            //save user to db

            const newUser = await User.create({
                name,
                email,
                password: hashedPassword,
                isVerified:false,
                 otp,
                 otpExpiry: Date.now() + 10 * 60 * 1000
            });

            await sendEmail(email, otp);

            res.status(201).json({
                message:"user registered successfully verify OTP ", 
                userId: newUser._id,
            });
      
    } catch (error) {
         res.status(500).json({ message: error.message });
          console.error(error.message);
    }
};          


// verify OTP email 

export const verifyOTP = async (req, res) => {
    try {
        
        const {email,otp}=req.body;
        
        if(!email || !otp){ 
            return res.status(400).json({message:"All fields are required"});
        }

        const user = await User.findOne({email});
        
        
        if (!user || String(user.otp) !== String(otp)) {

            return res.status(400).json({message:"Invalid OTP or email"});
        }

          if (user.otpExpiry < Date.now()) {
         return res.status(400).json({ message: "OTP expired" });
        }

         user.isVerified = true;
         user.otp = null;
         user.otpExpiry = null;
         await user.save();

         return res.status(200).json({message:"email verifed"})

}


     catch (error) {
        res.status(500).json({ message: error.message });
          console.error(error.message);
    }



};

export const resendOTP = async (req, res) => {
  try {
    
    const{email}=req.body;
     // validatiion 
     if(!email){
        return res.status(400).json({message:"Email is required"});
     }
     const user = await User.findOne({ email });

      if (!user) {  
      return res.status(404).json({ message: "User not found" });
     }

     // Already verified check

     if(user.isVerified){
      
        return res.status(400).json({ message: "User already verified" });
      }
          // Generate new OTP
          const newOtp = generateOTP();

          //console.log(" Re Generated OTP:", newOtp);

          //update User 
            user.otp = newOtp;
            user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
            await user.save();

            //  Send email (or console in dev) 

            await sendEmail(email, newOtp);

           return  res.status(200).json({ message: "New OTP sent to email" });



  }
  catch (error) {
    
      res.status(500).json({ message: error.message });
      console.error(error.message);
  }
};

export const login = async(req,res)=>{
    try {
        
        const{email,password}=req.body;

        if(!email || !password){
            return res.status(400).json({message:"All fields are required"});
        }

         const user = await User.findOne({ email });

          if (!user)
          return res.status(400).json({ message: "User not found" });

          if (!user.isVerified)
          return res.status(401).json({ message: "Verify email first" });

           const isMatch = await bcrypt.compare(password, user.password);

           if (!isMatch)
           return res.status(401).json({ message: "Wrong password" });
        

           const token = jwt.sign({
            id:user._id,
            role:user.role,
           },
         process.env.JWT_SECRET_TOKEN,
         {expiresIn:"2h"}

        );

        res.cookie("token",token,{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
             sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // CSRF protection
             maxAge: 2 * 60 * 60 * 1000 // 2 hours  Cookie expiration time
        });

      res.status(200).json({ 
         message: "Login successful", 
         role: user.role,
          username:user.name
          });
    
    }
    
    catch (error) {

          res.status(500).json({ message: error.message });
          console.error(error.message);
        
    }
}

export const forgotPassword =async(req,res)=>{
    try {
        
        const {email}=req.body;

        if(!email){
          return res.status(400).json({message:"Email fields are required"});
        }
        
        const user = await User.findOne({ email });

        if (!user)
        return res.status(404).json({ message: "User not found" });

        if (user.otpAttempts >= 3) {
  return res.status(429).json({message: "OTP limit reached. Try later" });
}

if (user.lastOtpSentAt) {
  const diff = (Date.now() - user.lastOtpSentAt.getTime()) / 1000;
  if (diff < 30) {
    return res.status(429).json({message: `Wait ${Math.ceil(30 - diff)} seconds` });
  }
}


          const forgotOtp=generateOTP();
            //console.log("forgotOtp generation :",forgotOtp);

          user.otp = forgotOtp;
          user.otpExpiry = Date.now() + 10 * 60 * 1000;
          user.otpAttempts += 1;  
          user.lastOtpSentAt = new Date();
              await user.save();

            
            
          await sendEmail(email, forgotOtp);

           res.json({ message: "OTP sent to email" });


    }
     catch (error) {
        res.status(500).json({ message: error.message });
          console.error(error.message);
    }
}


export const resendForgotOtp = async (req, res) => {

  try{

  const { email } = req.body;

  //valitation
  if(!email){
    return res.status(400).json({message:"All fields are required"});
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  //  Max attempts check

  if (user.otpAttempts >= 3) {
    return res.status(429).json({message: "OTP resend limit reached. Try after some time"});
  }

  //  Cooldown check (30 sec)
  if (user.lastOtpSentAt) {
    const diff = (Date.now() - user.lastOtpSentAt.getTime()) / 1000;

    if (diff < 30) {
      return res.status(429).json({ message: `Please wait ${Math.ceil(30 - diff)} seconds`});
    }
  }

  // Generate new OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  user.otp = otp;
  user.otpExpiry = Date.now() + 10 * 60 * 1000;
  user.otpAttempts += 1;
  user.lastOtpSentAt = new Date();

  await user.save();

  // send email
  await sendEmail(email, otp);

  res.json({ message: "OTP resent successfully" });
}  

catch(error){

   res.status(500).json({ message: error.message });
          console.error(error.message);
}
};

export const resetPassword = async (req, res) => {

    try {
  const { email, otp, newPassword } = req.body;

    if(!email || !otp || !newPassword){
      return res.status(400).json({message:"All fields are required"});
    }
  
if (!(await isStrongPassword(newPassword))) {
  return res.status(400).json({ message: "Weak password" });
}


  const user = await User.findOne({ email });

   if (!user || String(user.otp) !== String(otp)) {
  return res.status(400).json({ message: "Invalid OTP" });
}

if (user.otpExpiry < Date.now()) {
  return res.status(400).json({ message: "OTP expired" });
}


   const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  res.json({ message: "Password reset success" });
}
catch (error) {
        res.status(500).json({ message: error.message });
          console.error(error.message);
    }   };
  

export const logout = (req, res) => {
    try{
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  });

  res.json({ message: "Logged out successfully" });
} catch (error) {
    res.status(500).json({ message: "Logout failed" });
}       
};


