const { app } = require("./app.js");
const { fetchCategories, fetchReviews, fetchReviewComments } = require("./models.js");

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

exports.getReviewComments = (request, response, next) => {
    return fetchReviewComments(request.params.review_id)
        .then((comments) => response.status(200).send({ comments }))
        .catch(next)
}