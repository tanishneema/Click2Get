// const { findById, count } = require("../models/productModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures.js");
const cloudinary = require('cloudinary');

//Create Product -- ADMIN
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        if(typeof images[i]!=="string"){
            for (let j = 0; j < images[i].length; j++) {
                const result = await cloudinary.v2.uploader.upload(images[i][j], {
                    folder: "products",
                });
        
                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }
        }
        else{
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
            });
            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }
    }

    req.body.images = imagesLinks;
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
});

// Get All Product (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products,
    });
});

//Get all products
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
    const resultPerPage = 12;
    const productsCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()


    let products = await apiFeature.query;
    let filteredProductsCount = products.length;

    apiFeature.pagination(resultPerPage);

    products = await apiFeature.query.clone();

    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount,
    })
});

//Get Product Details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product)
        return next(new ErrorHandler("Product not Found", 404));

    res.status(200).json({
        success: true,
        product
    })
});

//Update Product -- ADMIN
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product)
        return next(new ErrorHandler("Product not Found", 404));

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product
    })
});

//Delete Product -- ADMIN
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product)
        return next(new ErrorHandler("Product not Found", 404));

    await product.remove();

    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    })
});

//Add or Update Reviews
exports.creatProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user.id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };
    const product = await Product.findById(productId);

    if (!product)
        return next(new ErrorHandler("Product not Found", 404));

    const isReviewed = product.reviews.find((rev) => rev.user.toString() === req.user._id.toString());

    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString())
                (rev.rating = rating), (rev.comment = comment);
        })
    } else {
        product.reviews.push(review);
        product.numberOfReviews = product.reviews.length;
    }

    let avg = 0;
    product.reviews.forEach(rev => {
        avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    if (product.reviews.length === 0)
        product.ratings = 0

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
});

//Get all reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    if (!product)
        return next(new ErrorHandler("Product not Found", 404));

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });
});

//Delete a review
//If person is admin or if person themselve have posted the review then only they are authorized to delete the review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
    if (!product)
        return next(new ErrorHandler("Product not Found", 404));

    const r1 = product.reviews.filter((rev) => rev._id.toString() === req.query.id.toString());
    r1.forEach((rev) => {
        userid = rev.user.toString();
    });

    const reviews = product.reviews.filter((rev) => rev._id.toString() !== req.query.id.toString());

    if (req.user.role === "admin" || req.user.id === userid) {

        let avg = 0;
        reviews.forEach((rev) => {
            avg += rev.rating;
        });

        let ratings = avg / reviews.length;
        if (reviews.length == 0)
            ratings = 0;
        const numberOfReviews = reviews.length;

        await Product.findByIdAndUpdate(req.query.productId, {
            reviews,
            ratings,
            numberOfReviews,
        }, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        res.status(200).json({
            success: true,
        });
    }
    else {
        return next(new ErrorHandler("Not Authorized", 401));
    }
});
