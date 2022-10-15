import React, { Fragment, useEffect } from 'react';
import Carousel from 'react-material-ui-carousel';
import "./ProductDetails.css";
import { useSelector, useDispatch } from 'react-redux';
import { clearErrors, getProductDetails } from '../../actions/productAction';
import { useParams } from 'react-router-dom';
import ReactStars from "react-rating-stars-component";
import ReviewCard from './ReviewCard';
import Loader from '../layout/Loader/Loader';
import { useAlert } from 'react-alert';

const ProductDetails = () => {

    const { id } = useParams();
    const dispatch = useDispatch();
    const alert = useAlert();
    const { product, loading, error } = useSelector((state) => state.productDetails)

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(getProductDetails(id))
    }, [dispatch, id, alert, error]);

    const options = {
        edit: false,
        color: "rgba(20,20,20,0.1)",
        activeColor: "orange",
        value: product.ratings,
        size: 25,
        isHalf: true
    };

    return (
        <Fragment>
            {loading ? <Loader /> : (<Fragment>
                <div className='ProductDetails'>
                    <div className='imageDiv'>
                        <Carousel>
                            {
                                product.images && product.images.map((item, i) => (

                                    <img src={item.url}
                                        className="CarouselImage"
                                        alt={`${i} Slide`}
                                        key={item.url} />

                                ))
                            }
                        </Carousel>
                    </div>
                    <div className='detailsDiv'>
                        <div className="detailsBlock-1">
                            <h2>{product.name}</h2>
                            <p>Product #{product._id}</p>
                        </div>
                        <div className="detailsBlock-2">
                            <ReactStars {...options} />
                            <span>({product.numberOfReviews} Reviews)</span>
                        </div>
                        <div className="detailsBlock-3">
                            <h1>{`₹${product.price}`}</h1>
                            <div className="detailsBlock-3-1">
                                <div className="detailsBlock-3-1-1">
                                    <button>-</button>
                                    <input value="1" type="number" />
                                    <button>+</button>
                                </div>{" "}
                                <button>Add to Cart</button>
                            </div>
                            <p>Status:{" "}
                                <b className={product.stock < 1 ? "redColor" : "greenColor"}>
                                    {product.stock < 1 ? "Out of Stock" : "In Stock"}
                                </b>
                            </p>
                        </div>
                        <div className='detailsBlock-4'>
                            Description: <p>{product.description}</p>
                            Company: <p>{product.manufacturer}</p>
                        </div>
                        <button className="submitReview">Submit Review</button>
                    </div>
                </div>

                <h3 className="reviewsHeading">Reviews</h3>
                {product.reviews && product.reviews[0] ? (
                    <div className="reviews">
                        {product.reviews && product.reviews.map((review) => <ReviewCard review={review} key={review._id} />)}
                    </div>
                ) : (
                    <p className='noReviews'>Be the first one to review.</p>
                )};
            </Fragment>)}
        </Fragment>

    );
};

export default ProductDetails