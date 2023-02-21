const express = require('express');
const app = express();
const { getCategories, getReviews } = require("./controller.js")

app.use(express.json())


app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.use((err, req, res, next) => {
    res.status(500).send("Server Error!")
})

module.exports = { app };