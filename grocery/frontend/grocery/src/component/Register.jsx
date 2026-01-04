import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
    const[name,setName]=useState("");
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const[error,setError]=useState("");
    const[loading,setLoading]=useState(false);

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
          <input type="text" placeholder="Name"
          value={name} 
          onChange={(e)=>setName(e.target.value)}/>

          <input type="email" placeholder="Email"
          value={email} 
          onChange={(e)=>setEmail(e.target.value)}/>

          <input type="password" placeholder="Password"
          value={password} 
          onChange={(e)=>setPassword(e.target.value)}/>

          
         {error && <p style={{ color: "red" }}>{error}</p>}

         <button onClick={handleRegister} disabled={loading}>
          {loading ? "Registering..." : "Register Wait Otp Verification"}
         </button>


    </div>
  );
}

export default Register;
