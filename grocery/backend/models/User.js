import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
    trim:true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase:true,
    trim:true,

  },

  password: {
    type: String,
    required: true,
    trim:true,

  },
  mobile: {
  type: String,
  match: /^[6-9]\d{9}$/, // Tamil Nadu valid
},

address: {
  type: String,
  trim: true
},

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },

  isVerified: {
    type: Boolean,
    default: false
  },


  otpAttempts: {
  type: Number,
  default: 0
},


lastOtpSentAt: {
  type: Date
},

  otp: String,
  otpExpiry: Date
},

{timestamps:true}
);

export const User = mongoose.model('User', userSchema);