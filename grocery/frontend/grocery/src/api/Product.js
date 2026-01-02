import axios from "axios";

const API = axios.create({ 
    baseURL: "http://localhost:7000/api/products",
    withCredentials:true

 });

export const getAllProducts = () => API.get("/");
export const getProductById = (id) => API.get(`/${id}`);
export const searchProducts = (query) => API.get(`/search?search=${query}`);
export const addProduct =(data)=>API.post("/products", data);
export const updateProduct = (id,data)=>API.put(`/products/${id}`, data);
export const deleteProduct=(id)=>API.delete(`/products/${id}`);
