const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonWebToken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name."],
        maxLength: [30, "Name length shouldn't exceed 30 characters."],
        minLength: [3, "Enter complete name."]
    },
    email: {
        type: String,
        required: [true, "Please enter your name"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid Mail Id."]
    },
    password: {
        type: String,
        required: [true, "Please enter your name"],
        minLength: [8, "Password length should be greater than 8 characters."],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user",
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {

    if (!this.isModified("password"))
        next();

    this.password = await bcryptjs.hash(this.password, 10);
});

//JWT Token
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

//Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcryptjs.compare(enteredPassword, this.password);
};

//Reset Forgotten Password
userSchema.methods.getResetPasswordToken = function () {
    //Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //Hashing and adding to userSchema 
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};

module.exports = mongoose.model("User", userSchema);