const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const cloudinary = require('cloudinary');

//Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
    });
    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    });

    sendToken(user, 201, res);
});

//Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    //Checking if user has give both email and password
    if (!email || !password)
        return next(new ErrorHandler("Please enter Email and Password", 400));

    const user = await User.findOne({ email }).select("+password");

    if (!user)
        return next(new ErrorHandler("Invalid Email address or Password", 401));

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched)
        return next(new ErrorHandler("Invalid Email address or Password", 401));

    sendToken(user, 200, res);
});

// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });


    res.status(200).json({
        success: true,
        message: "Logout Successful"
    });
});

//Forgot Password
exports.forgetPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user)
        return next(new ErrorHandler("User not found", 404));

    //Get Reset Password Token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
    // const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message = `Your password has been reset successfully \n\nYour new password token is :- \n\n${resetPasswordUrl}\n\n If you did not request for password change, please Ignore.`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Click 2 Get Password Recovery",
            message,
        });

        res.status(200).json({
            success: true,
            message: `Mail sent successfully to ${user.email}`
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
});

//Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    //Creating Token Hash
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
        return next(new ErrorHandler("Reset Password Token is invalid or has expired", 400));

    if (req.body.password !== req.body.confirmPassword)
        return next(new ErrorHandler("Password didn't match", 400));

    // const isPasswordMatched = await user.comparePassword(req.body.password);

    // if (isPasswordMatched)
    //     return next(new ErrorHandler("Try using a new password", 401));

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});

//Get User Details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    });
});

//Update User Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched)
        return next(new ErrorHandler("Old Password is incorrect", 400));

    if (req.body.newPassword !== req.body.confirmPassword)
        return next(new ErrorHandler("Password doesn't match", 400));

    const newPassMatched = await user.comparePassword(req.body.newPassword);

    if (newPassMatched)
        return next(new ErrorHandler("Try using a new password", 400));

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 200, res);
});

//Update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,  //If you Want to change the Mail ID
    };

    if (req.body.avatar !== "") {
        const user = await User.findById(req.user.id);
        const imageId = user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        })

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        userFindAndModify: false
    })

    res.status(200).json({
        success: true,
    });
});

//Get all users -- ADMIN
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    });
});

//Get single users -- ADMIN
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user)
        return next(new ErrorHandler(`User not found with ${req.params.id} Id`, 404))

    res.status(200).json({
        success: true,
        user,
    });
});


//Update User Role -- ADMIN
exports.updateRole = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        role: req.body.role,
        email: req.body.email,  //If you Want to change the Mail ID
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        userFindAndModify: false
    })

    res.status(200).json({
        success: true,
    });
});

//Delete User -- ADMIN
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
        return next(new ErrorHandler(`User not exist with ${req.params.id}`, 400));

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    await user.remove();

    res.status(200).json({
        success: true,
        message: "User Deleted Successfully."
    });
});