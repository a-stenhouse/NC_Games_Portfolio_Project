const express = require('express');
const app = express();
const cors = require("cors")
const { getCategories, getReviews, postComment, getReviewID, getReviewComments, patchVotes, getUsers, deleteComment } = require("./controller.js")

app.use(cors());

app.use(express.json())

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.patch("/api/reviews/:review_id", patchVotes)

app.post("/api/reviews/:review_id/comments", postComment)

app.get("/api/reviews/:review_id", getReviewID)

app.get("/api/reviews/:review_id/comments", getReviewComments)

app.get("/api/users", getUsers)

app.delete("/api/comments/:comment_id", deleteComment)

app.use((err, req, res, next) => {
    if (err.code === "23502") {
        res.status(400).send({ msg: "Malformed body / missing required fields" })
    } else if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg })
    } else if (err.code === "23503" && err.constraint === "comments_review_id_fkey") {
        res.status(404).send({ msg: "Review_id does not exist in database" })
    } else if (err.code === "23503") {
        res.status(404).send({ msg: "Username does not exist in database" })
    } else if (err.code === "22P02") {
        res.status(400)
            .send(Object.hasOwn(req.body, "inc_votes") ? { msg: "Not a valid review_id / no. of votes" } : { msg: "Not a valid ID, must be a number" })
    } else {
        res.status(500).send("Server Error!")
    }
})

module.exports = app;