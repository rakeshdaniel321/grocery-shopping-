import React from "react";
import { useState} from "react";
import { useNavigate } from "react-router-dom";


function Login (){

    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const [error,setError]=useState('');
    const [loading,setLoading]=useState(false);

    const handleLogin = async ()=>{
        if(!email || !password){
            setError(" All fields are required");
            return;
        }
        try {
            
            
            
        } catch (error) {
            
        }
    }

    return(
        <div>

            <input type="email" placeholder="Email" value={email}
            onChange={(e)=>setEmail(e.target.value)}/>

              <input type="password" placeholder="Password" value={password}
            onChange={(e)=>setPassword(e.target.value)}/>

             {error && <p style={{ color: "red" }}>{error}</p>}



        </div>
    );
};