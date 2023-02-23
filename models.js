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

function postingComment(username, body, reviewid) {
    const date = new Date(1677150706000)
    return db.query(`INSERT INTO comments (body, votes, author, review_id, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *;`, [body, 0, username, reviewid, date])
        .then((result) => result.rows[0]);
}


module.exports = { fetchCategories, fetchReviewID }
