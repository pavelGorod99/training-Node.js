const mongoose = require("mongoose");

const manufactureSchema = new mongoose.Schema([
    {
        country: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: false
        },
        city: {
            type: String,
            required: true
        }
    }
]);

const electricCarSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        company: {
            type: String,
            required: true
        },
        year: {
            type: Number,
            required: true
        },
        manufactures: {
            type: [manufactureSchema],
            required: true
        }
    }
);

mongoose.model("ElectricCar", electricCarSchema, "electricCars");