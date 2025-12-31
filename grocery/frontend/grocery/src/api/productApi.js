import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:7000",
  withCredentials: true // cookie (JWT)
});

export const getProducts = () => API.get("/products");
export const getProduct = (id) => API.get(`/products/${id}`);

export const addProduct = (formData) =>
  API.post("/products", formData);

export const updateProduct = (id, formData) =>
  API.put(`/products/${id}`, formData);

export const deleteProduct = (id) =>
  API.delete(`/products/${id}`);
