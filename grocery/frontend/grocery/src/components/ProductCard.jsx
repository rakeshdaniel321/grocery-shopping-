

const ProductCard =({product})=> {

    return (
        <>
        <div>
            <img src={product.images[0].url} width= "150"/>
            <h3>{product.name}</h3>
            <p>₹{product.price}</p>

        </div>
        
        </>
    );
};