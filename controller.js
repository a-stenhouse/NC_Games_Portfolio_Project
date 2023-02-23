const { app } = require("./app.js");
const { fetchCategories, fetchReviews, postingComment } = require("./models.js");

exports.getCategories = (request, response, next) => {
    return fetchCategories()
        .then((categories) => response.status(200).send({ categories }))
        .catch(next);
};

exports.getReviews = (request, response, next) => {
    return fetchReviews()
        .then((reviews) => response.status(200).send({ reviews }))
        .catch(next);
};

exports.postComment = (request, response, next) => {
    const { username, body } = request.body
    const review_id = request.params.review_id
    return postingComment(username, body, review_id)
        .then((comment) => response.status(201).send({ comment }))
        .catch(next)
}