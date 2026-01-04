import {useLocation,useNavigate} from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';


function VerifyOtp() {

const location =useLocation();
const navigate =useNavigate();
const email=location.state?.email;

const [otp, setOtp] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const handleVerifyOtp = async ()=>{
    if(!otp){
         setError('OTP is required');
         return;
    }
    setError("");
    setLoading(true);
    try {
        await axios.post("http://localhost:7000/api/auth/verify-otp",{ email, otp } );

         alert("Email verified successfully");
         navigate("/login");


        
    } catch (error) {
        setError(error.response?.data?.message || "Invalid OTP");
    }
    finally{
        setLoading(false);
    }
}

const handleResendOtp = async()=>{

    if(!email){
        navigate("/register");
    }

    try{
     await axios.post( "http://localhost:7000/api/auth/resend-otp", { email } );

     alert("OTP resent");
}
catch(err){
    setError(err.response?.data?.message || " Invalid  OTP ");

}
finally{
    setLoading(false);
}
};


  return (
    <div>
    
    <input  type="text"  placeholder="Enter OTP"  value={otp}
     onChange={(e) => setOtp(e.target.value)}/>
     
      {error && <p style={{ color: "red" }}>{error}</p>}

     <button onClick={handleVerifyOtp} disabled={loading}>
      {loading ? "Verifying..." : "Verify OTP"}
     </button>

    <button onClick={handleResendOtp} disabled={loading}>
    {loading ? "resending..." : "resend OTP"}
    </button>

    </div>
  );

}
export default VerifyOtp;
