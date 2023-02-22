const express = require('express');
const app = express();
const { getCategories, getReviewID } = require("./controller.js")


app.get("/api/categories", getCategories)

app.get("/api/reviews/:review_id", getReviewID)


app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(404).send({ msg: err.msg })
    } else if (err.code === "22P02") {
        res.status(400).send({ msg: "Not a valid user ID" })
    } else {
        res.status(500).send("Server Error!")
    }

})


module.exports = { app };