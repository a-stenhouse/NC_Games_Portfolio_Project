const { app } = require("./app.js");
const { fetchCategories, fetchReviews, updateVotes } = require("./models.js");

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

exports.patchVotes = (request, response, next) => {
    const { inc_votes } = request.body
    const review_id = request.params.review_id
    return updateVotes(inc_votes, review_id)
        .then((review) => response.status(200).send({ review }))
        .catch(next)
}