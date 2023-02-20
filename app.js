const express = require('express');
const app = express();
const { getCategories } = require("./controller.js")

app.use(express.json());


app.get("/api/categories", getCategories)

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send("Server Error!")
})

module.exports = { app };