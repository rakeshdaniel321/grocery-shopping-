import express from 'express';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const registerUser = async (req, res)=>
{
    try {
        const { name, email, password } = req.body;

        // validation
        if(!name || !email || !password) {
            return res.status(400).json({ message:"All filds are required"});
        }

         // check if user already exists user aalready irukka login pannungala 

         const existsUser = await User.findOne({ email });

         if(existsUser) {
            return res.status(409).json({ message: "User already exists. Please login"});
         }

            //hash password password hash panrathu 

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            //save user to db

            const newUser = await User.create({
                name,
                email,
                password: hashedPassword,
            });

            res.status(201).json({
                message:"user registered successfully", 
                userId: newUser._id,
            });
      
    } catch (error) {
         res.status(500).json({ message: error.message });
        
    }
}            