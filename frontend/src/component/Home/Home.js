import React, { Fragment, useEffect } from 'react';
import { CgMouse } from "react-icons/cg"
import "./Home.css"
import Product from "./ProductCard.js"
import MetaData from '../layout/MetaData';
import { clearErrors, getProduct } from "../../actions/productAction";
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../layout/Loader/Loader';
import { useAlert } from 'react-alert';

const Home = () => {
    const alert = useAlert();
    const dispatch = useDispatch();
    const { loading, error, products } = useSelector((state) => state.products)

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(getProduct());
    }, [dispatch, error, alert]);

    return (
        <Fragment>
            {loading ? (<Loader />) : (<Fragment>
                <MetaData title="Click 2 Get" />
                <div className="banner">
                    <p>Welcome to Click 2 Get</p>
                    <h1>Find Product of Your Choice</h1>

                    <a href="#container">
                        <button>
                            Scroll <CgMouse />
                        </button>
                    </a>
                </div>
                <h2 className="homeHeading">Featured Products</h2>
                <div className="container" id="container">
                    {products && products.map(product => (
                        <Product product={product} key={product._id} />
                    ))}
                </div>
            </Fragment>)
            }
        </Fragment>
    );
};

export default Home