const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require('jsonWebToken');
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token)
        return next(new ErrorHandler("Login in or Sign Up", 401));

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);

    next();
});

exports.authorizeRoles = (...roles) => {

    return (req, res, next) => {
        if (!roles.includes(req.user.role))
            return next(new ErrorHandler(`${req.user.role} is not authorized to access this resource.`, 403));

        return next();
    };
};

