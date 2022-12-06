const app = require('./app')
// const dotenv = require("dotenv")
const connectDatabase = require("./config/database")
const cloudinary = require('cloudinary');

//Handling Uncaught Error
process.on("uncaughtException", err => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the system due to Uncaught Error`);
    process.exit(1);
});

//Config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "backend/config/config.env" });
}

//Connecting to Database
connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDNIARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`)
})

//Handling Unhandled Promise Rejection
process.on("unhandledRejection", err => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the system due to Unhandled Promise Rejection`);

    server.close(() => {
        process.exit(1);
    });
});