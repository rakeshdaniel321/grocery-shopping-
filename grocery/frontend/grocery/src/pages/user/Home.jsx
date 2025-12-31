import { useState,useEffect } from "react";
import { getProducts } from "../../api/productApi";
import ProductCard from "../../components/ProductCard";

const Home = ()=>{

    const [products,SetProduct]=useState([]);

    useEffect(()=>{
        getProducts().then(res=>{
            SetProduct(res.data.products);
        });

    },[]);


    return(
    <>
    <div>

      <h2>Products</h2>

      {products.map(p=>(
        <ProductCard  key={p._id} product={p}/>
      ))}

    </div>
    </>
    );
}

export default Home;