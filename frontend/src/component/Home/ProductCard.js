import React from 'react'
import { Link } from "react-router-dom"
import ReactStars from "react-rating-stars-component"
import "./Home.css"


const ProductCard = ({ product }) => {
    const options = {
        edit: false,
        color: "rgba(20,20,20,0.1)",
        activeColor: "orange",
        readOnly: true,
        precision: 0.5,
        value: product.ratings,
        size: window.innerWidth < 600 ? 20 : (window.innerWidth < 1000 ? 18 : 20),
        isHalf: true
    };
    return (
        <Link className="productCard" to={`/product/${product._id}`}>
            <img src={product.images[0].url} alt={product.name} />
            <p>{product.name}</p>
            <div>
                <ReactStars {...options} />{" "}
                <span>({product.numberOfReviews} Reviews)</span>
            </div>
            <span>{`₹${product.price}`}</span>
        </Link>
    );
};

export default ProductCard