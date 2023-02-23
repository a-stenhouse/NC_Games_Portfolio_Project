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

function postingComment(username, body, reviewid) {
    const date = new Date(1677150706000)
    return db.query(`INSERT INTO comments (body, votes, author, review_id, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *;`, [body, 0, username, reviewid, date])
        .then((result) => result.rows[0]);
}

module.exports = { fetchCategories, fetchReviews, postingComment }
