const { app } = require("./app.js");
const { fetchCategories, fetchReviewID } = require("./models.js");

exports.getCategories = (request, response, next) => {
    return fetchCategories()
        .then((categories) => response.status(200).send({ categories }))
        .catch(next);
};

exports.getReviewID = (request, response, next) => {
    return fetchReviewID(request.params.review_id)
        .then((review) => response.status(200).send({ review }))
        .catch(next);
}