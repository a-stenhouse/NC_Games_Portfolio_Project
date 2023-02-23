const express = require('express');
const app = express();
const { getCategories, getReviews, postComment, getReviewID } = require("./controller.js")

app.use(express.json())

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewID)

app.post("/api/reviews/:review_id/comments", postComment)

app.use((err, req, res, next) => {
    if (err.code === "23502") {
        res.status(400).send({ msg: "Malformed body / missing required fields" })
    } else if (err.status && err.msg) {
        res.status(404).send({ msg: err.msg })
    } else if (err.code === "23503" && err.constraint === "comments_review_id_fkey") {
        res.status(404).send({ msg: "Review_id does not exist in database" })
    } else if (err.code === "23503") {
        res.status(404).send({ msg: "Username does not exist in database" })
    } else if (err.code === "22P02") {
        res.status(400).send({ msg: "Not a valid review ID, must be a number" })
    } else {
        res.status(500).send("Server Error!")
    }



})

// app.use((err, req, res, next) => {

//     else if (err.code === "22P02") {
//         res.status(400).send({ msg: "Not a valid user ID" })
//     }
// })


module.exports = { app };