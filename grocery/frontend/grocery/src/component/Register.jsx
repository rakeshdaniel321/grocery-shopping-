import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import  '../styles/auth.css';

function Register() {
    const[name,setName]=useState("");
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const[error,setError]=useState("");
    const[loading,setLoading]=useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async()=>{
      if (!name || !email || !password) {
         setError("All fields are required");
          return;
       }
        setError("");
        setLoading(true);

        try {

          const res = await axios.post( "http://localhost:7000/api/auth/register", { name, email, password });

          navigate("/verify-otp", { state: { email } });

        } catch (err) {
          
          setError(err.response?.data?.message || "Something went wrong");
        }
        finally {
        setLoading(false);
    }
    };



  return (
    <div>
      <div className="auth-container">
        
      <div className="auth-card">
        <div className="auth-left">

          <h2>Create Account</h2>

          <p>Register to continue</p>


          <input type="text"  className="auth-input" placeholder="Name"
          value={name} 
          onChange={(e)=>setName(e.target.value)}/>

          <input type="email" className="auth-input" placeholder="Email"
          value={email} 
          onChange={(e)=>setEmail(e.target.value)}/>
           <div className="password-box">
          <input type={showPassword ? "text" : "password"} className="auth-input" placeholder="Password"
          value={password} 
          onChange={(e)=>setPassword(e.target.value)}/>

          <span onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? "🙈" : "👁️"}
          </span>

          </div>

          
         {error &&  <div className="auth-error"> {error}</div>}




         <button  className="auth-btn"  onClick={handleRegister} disabled={loading}>
        {loading ? "Registering..." : "Register Wait Otp Verification"}
        </button>

    </div></div></div>
    </div>
  );
}

export default Register;
