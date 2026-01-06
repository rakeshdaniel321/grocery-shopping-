import React from "react";
import { useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';


function Login (){

    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const [error,setError]=useState('');
    const [loading,setLoading]=useState(false);
    const [showPassword, setShowPassword] = useState(false);


    const handleLogin = async ()=>{
        if(!email || !password){
            setError(" All fields are required");
            return;
        }
        setError("");
        setLoading(false);

        try {
            const res = await axios.post("http://localhost:7000/api/auth/login",
            { email, password },
            { withCredentials: true } );

            const {role} =res.data;
            if (role === "admin") {
            navigate("/admin/dashboard");
             }    
             
            else {
            navigate("/customer/profile"); 
            }
            
        } catch (error) {
            setError(error.response?.data?.message || "Login failed")
            
        }
    }

    return(
        <div>

            <input type="email" placeholder="Email" value={email}
            onChange={(e)=>setEmail(e.target.value)}/>

            <div className="password-box">

              <input type={showPassword ? "text" :"password"}  className="auth-input" placeholder="Password" value={password}
            onChange={(e)=>setPassword(e.target.value)}/>

            <span onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? "🙈" : "👁️"}
          </span>
           
            </div>

             {error && <p style={{ color: "red" }}>{error}</p>}

          <button onClick={handleLogin} disabled={loading}>
           {loading ? "Logging in......" : "Login "}
         </button>


        </div>
    );
};

export default Login;