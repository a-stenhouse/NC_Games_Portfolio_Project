const db = require("./db/connection.js");

function fetchCategories() {
    return db.query(`SELECT * FROM categories;`)
        .then((result) => result.rows);
};

function fetchReviews() {
    return db.query(`SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, COUNT(comments.body)::INT AS comment_count
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    GROUP BY reviews.review_id
    ORDER BY review_id ASC;`)
        .then((result) => result.rows)
}

function updateVotes(votes, reviewid) {
    return db.query(`SELECT votes FROM reviews WHERE review_id = $1;`, [reviewid])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: `Review_id does not exist`
                })
            } else if (result.rows[0].votes + votes < 0) {
                return Promise.reject({
                    status: 400,
                    msg: `Cannot decrement votes below zero`
                })
            }
        })
        .then(() => {
            return db.query(`UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;`, [votes, reviewid])
        })
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({
                    status: 400,
                    msg: "Not a valid review_id, must be a number"
                })
            } else {
                return result.rows[0];
            }
        });
}

module.exports = { fetchCategories, fetchReviews, updateVotes }