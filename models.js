const db = require("./db/connection.js");

function fetchCategories() {
    return db.query(`SELECT * FROM categories;`)
        .then((result) => result.rows);
};

function fetchReviewID(reviewID) {
    return db.query(`SELECT review_id, title, review_body, designer, review_img_url, votes, category, owner, created_at FROM reviews WHERE review_id = $1;`, [reviewID])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: `No review found with review_id: ${reviewID}`
                })
            }
            return result.rows[0];
        });
}
function fetchReviews(category = "", sortBy = "review_id", sortOrder = "DESC") {
    return db.query(`SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, COUNT(comments.body)::INT AS comment_count
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    ${category ? `WHERE reviews.category='${category}' ` : ''} 
    GROUP BY reviews.review_id
    ORDER BY ${sortBy} ${sortOrder};`)
        .then((result) => result.rows)
        .catch((err) => console.log(err))
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

function fetchReviewComments(review_id) {
    return db.query(`SELECT comment_id, votes, created_at, author, body, review_id FROM comments
    WHERE review_id = $1
    ORDER BY created_at DESC;`, [review_id])
        .then((result) => {
            return result.rows;
        });
}

function postingComment(username, body, reviewid) {
    return db.query(`INSERT INTO comments (body, votes, author, review_id) VALUES ($1, $2, $3, $4) RETURNING *;`, [body, 0, username, reviewid])
        .then((result) => result.rows[0]);
}

function fetchUsers() {
    return db.query(`SELECT * FROM users;`)
        .then((result) => result.rows)
}

function removeComment(comment_id) {
    return db.query('DELETE FROM comments WHERE comment_id = $1 RETURNING *;', [comment_id])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: `No comment found with comment_id: ${comment_id}`
                })
            }
            return result.rows[0]
        })
}

module.exports = { fetchCategories, fetchReviews, postingComment, fetchReviewID, fetchReviewComments, updateVotes, fetchUsers, removeComment }