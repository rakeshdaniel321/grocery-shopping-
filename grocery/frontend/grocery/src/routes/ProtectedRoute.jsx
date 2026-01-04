import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({children,role}){
    const {user}= useAuth();
    const Navigate =useNavigate();
    
     if (!user) {
    return <Navigate to="/login" />;
  }

     if (role && user.role !== role) {
           return <Navigate to="/" />;
     }

     return children;
     }

export default ProtectedRoute;