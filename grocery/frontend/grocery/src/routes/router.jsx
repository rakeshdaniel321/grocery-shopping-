import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../component/Login";
import Register from "../component/Register";
import VerifyOtp from "../component/VerifyOtp";
import Profile from "../pages/customer/Profile";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";


const router =createBrowserRouter([
{
    path :"/",
    element:<Home/>
},
{
    path:"/login",
    element:<Login/>
},
{
    path:"/register",
    element:<Register/>
},
{
    path:"/verify-otp",
    element:<VerifyOtp/>
},
{
    path:"/profile",
    element:(<ProtectedRoute>
      <Profile />
    </ProtectedRoute>)
},
{
    path:"/admin/dashboard",
    element:(
    <ProtectedRoute role="admin" >
    <AdminDashboard/>
    </ProtectedRoute>)
},

]
);

export default router;