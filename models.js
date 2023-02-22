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

function fetchReviewComments(review_id) {
    return db.query(`SELECT comment_id, votes, created_at, author, body, review_id FROM comments
    WHERE review_id = $1
    ORDER BY created_at DESC;`, [review_id])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: `No comments found with review_id: ${review_id}`
                });
            };
            return result.rows;
        });
}

module.exports = { fetchCategories, fetchReviews, fetchReviewComments }
