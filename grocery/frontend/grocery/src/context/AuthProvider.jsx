import { createContext, useContext,useEffect,useState } from "react";
import axios from "axios";
import { loginUser, logoutUser } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider =({children})=>{
 
const [user ,setUser]=useState(null);
const [loading,setLoading]=useState(true);

useEffect(()=>{
    const CheckLoginStatus =async ()=>{
    try {
        const res =await axios.get("http://localhost:7000/api/auth/me",{withCredentials:true});
        setUser(res.data.user);

    } catch (error) {
        setUser(null);

    }
    finally{
        setLoading(false);
    }
    };
    useEffect(()=>{
        CheckLoginStatus();
    },[]);

    const login =async(formData)=>{
        const res =await loginUser(formData);
        setUser(res.data.user);
        return res.data;

    };
    const logout = async()=>{
        try {
            await logoutUser();
            
        } 
        catch(error){
            console.log("logout Auth error",error);
        }
        finally{
            setUser(null);
            window.location.href ='/login';
        }
    };
    return(
        <AuthContext.Provider value={{user,login,logout,loading,isAuthenticated:!!user}}>{!loading && children}</AuthContext.Provider>
    )
})
}