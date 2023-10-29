const mongoose = require("mongoose")
require("dotenv").config();


function databaseConnect() {
    mongoose.connect(process.env.DB_URL);

    mongoose.connection.on("connected", () => {
        console.log("Database connected successfully");
    });

    mongoose.connection.on("error", (error) => {
        console.log("Failed Database connection", error)
    });
}

module.exports = { databaseConnect };