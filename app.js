require("./api/data/dbconnection");
const routes = require("./api/routes");
const express = require("express");
const app = express();

app.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

const server = app.listen(3000, function() {
    console.log("Server started at port ", 3000);
});