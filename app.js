const express = require('express');
const app = express();
const { getCategories, getReviews, patchVotes } = require("./controller.js")

app.use(express.json())


app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.patch("/api/reviews/:review_id", patchVotes)

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg })
    } else if (err.code === "22P02") {
        res.status(400).send({ msg: "Not a valid review_id / no. of votes" })
    } else {
        res.status(500).send("Server Error!")
    }
})

module.exports = { app };