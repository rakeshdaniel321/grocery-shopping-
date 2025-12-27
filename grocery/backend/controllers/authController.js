import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { isStrongPassword } from '../utils/erorrHandling.js';

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

            //save user to db

            const newUser = await User.create({
                name,
                email,
                password: hashedPassword,
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

        if(!user || user.otp !== otp){

            return res.status(400).json({message:"Invalid OTP or email"});
        }

          if (user.otpExpiry < Date.now()) {
         return res.status(400).json({ message: "OTP expired" });
        }

         user.isVerified = true;
         user.otp = null;
         user.otpExpiry = null;
         await user.save();

         return res.status(201).json({message:"email verifed"})

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

      res.status(200).json({  message: "Login successful",  role: user.role, username:user.name  });
    
    }
    
    catch (error) {

          res.status(500).json({ message: error.message });
          console.error(error.message);
        
    }
}

export const forgotPassword =async(req,res)=>{
    try {
        
        const {email}=req.body;
        
        const user = await User.findOne({ email });

        if (!user)
        return res.status(404).json({ message: "User not found" });

         const otp = generateOTP();
          user.otp = otp;
           user.otpExpiry = Date.now() + 10 * 60 * 1000;
           await user.save();

          await sendEmail(email, otp);

           res.json({ message: "OTP sent to email" });


    }
     catch (error) {
        res.status(500).json({ message: error.message });
          console.error(error.message);
    }
}


export const resetPassword = async (req, res) => {

    try {
  const { email, otp, newPassword } = req.body;

  

  if (!isStrongPassword(newPassword)) {
    return res.status(400).json({ message: "Weak password" });
  }

  const user = await User.findOne({ email });

  if (!user || user.otp !== otp)
    return res.status(400).json({ message: "Invalid OTP" });

  if (user.otpExpiry < Date.now())
    return res.status(400).json({ message: "OTP expired" });

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
