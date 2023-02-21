const { app } = require("./app.js");
const { fetchCategories, fetchReviews } = require("./models.js");
const { addTotalComments } = require("./utils.js");

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
