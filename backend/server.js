const app = require('./app')
const dotenv = require("dotenv")
const connectDatabase = require("./config/database")

//Handling Uncaught Error
process.on("uncaughtException", err => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the system due to Uncaught Error`);
    process.exit(1);
});

//Config
dotenv.config({ path: "backend/config/config.env" })

//Connecting to Database
connectDatabase();

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