const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

mongoose.model("User", userSchema, "user");