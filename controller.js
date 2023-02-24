const { app } = require("./app.js");
const { fetchCategories, fetchReviews, postingComment, fetchReviewID, fetchReviewComments } = require("./models.js");

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
exports.getReviews = (request, response, next) => {
    return fetchReviews()
        .then((reviews) => response.status(200).send({ reviews }))
        .catch(next);
};

exports.getReviewComments = (request, response, next) => {
    return fetchReviewID(request.params.review_id)
        .then(() => {
            return fetchReviewComments(request.params.review_id)
        })
        .then((comments) => response.status(200).send({ comments }))
        .catch(next)
}

exports.postComment = (request, response, next) => {
    const { username, body } = request.body
    const review_id = request.params.review_id
    return postingComment(username, body, review_id)
        .then((comment) => response.status(201).send({ comment }))
        .catch(next)
}