const express = require('express');
const app = express();
const { getCategories, getReviews, getReviewComments } = require("./controller.js")

app.use(express.json())


app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id/comments", getReviewComments)

app.use((err, req, res, next) => {
    if (err.msg && err.status) {
        res.status(err.status).send({ msg: err.msg })
    } else if (err.code === "22P02") {
        res.status(400).send({ msg: "Bad request" })
    } else {
        res.status(500).send("Server Error!")
    }


})

module.exports = { app };