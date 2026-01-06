import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import "../styles/auth.css";

function AuthWrapper() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-container">
      <div className={`auth-card slide ${isLogin ? "login" : "register"}`}>
        
        <div className="auth-left">
          {isLogin ? <Login /> : <Register />}

          <p className="toggle-text">
            {isLogin ? "Don’t have an account?" : "Already have an account?"}
            <span onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? " Register" : " Login"}
            </span>
          </p>
        </div>

        <div className="auth-right">
          <h2>{isLogin ? "Welcome Back 👋" : "Join With Us 🚀"}</h2>
        </div>
      </div>
    </div>
  );
}

export default AuthWrapper;
