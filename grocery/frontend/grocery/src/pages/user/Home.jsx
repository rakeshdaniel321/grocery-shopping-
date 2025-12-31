import { useState,useEffect } from "react";
import { getProducts } from "../../api/productApi";


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
        <productCard  key={p._id} product={p}/>
      ))}

    </div>
    </>
    );
}

export default Home;