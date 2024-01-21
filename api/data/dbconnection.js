require("./electric-cars.model");
require("./user.model");

const mongoose = require("mongoose");
const callbackify = require("util").callbackify;

const mongooseCloseDBConnection = callbackify(function() {
    return mongoose.connection.close();
});

mongoose.connect("mongodb://127.0.0.1:27017/electricCars", { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on("connected", function() {
    console.log("Mongoose connected to " + "electricCars");
});

mongoose.connection.on("disconnected", function() {
    console.log("Mongoose disconnected");
});

mongoose.connection.on("error", function(err) {
    console.log("Mongoose connection error: " + err);
});

process.on("SIGINT", function() {
    mongooseCloseDBConnection(function() {
        console.log("Mongoose disconnected by app dissconect");
        process.exit(0);
    });
});