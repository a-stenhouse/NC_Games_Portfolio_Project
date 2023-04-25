const db = require("./db/connection.js");

function fetchEndpoints() {
    return {
        "GET /api": {
            "description": "returns a json representation of all available endpoints of the api"
        },
        "GET /api/categories": {
            "description": "responds with JSON containing an array of category objects with a key of 'categories'",
            "queries": [],
            "exampleResponse": {
                "categories": [{
                    "slug": "strategy",
                    "description": "Strategy-focused board games that prioritise limited-randomness"
                }, {
                    "slug": "hidden-roles",
                    "description": "One or more players around the table have a secret, and the rest of you need to figure out who! Players attempt to uncover each other's hidden role"
                }]
            }
        },
        "GET /api/reviews": {
            "description": "responds with JSON containing an array of reviews with key of reviews",
            "queries": ["category", "sortBy", "order"],
            "exampleResponse": {
                "reviews": [{
                    "owner": "jessjelly",
                    "title": "Escape The Dark Sector",
                    "review_id": 24,
                    "category": "push-your-luck",
                    "review_img_url": "https://images.pexels.com/photos/3910141/pexels-photo-3910141.jpeg?w=700&h=700",
                    "created_at": "2021-01-18T10:09:05.610Z",
                    "votes": 14,
                    "designer": "Alex Crispin,",
                    "comment_count": 5
                }]
            }
        },
        "GET /api/reviews/:review_id": {
            "description": "responds with JSON containing the expected review according to the review ID",
            "queries": [],
            "exampleResponse": {
                "review": {
                    "review_id": 2,
                    "title": "JengARRGGGH!",
                    "review_body": "Few games are equiped to fill a player with such a defined sense of mild-peril, but a friendly game of Jenga will turn the mustn't-make-it-fall anxiety all the way up to 11! Fiddly fun for all the family, this game needs little explaination. Whether you're a player who chooses to play it safe, or one who lives life on the edge, eventually the removal of blocks will destabilise the tower and all your Jenga dreams come tumbling down.",
                    "designer": "Leslie Scott",
                    "review_img_url": "https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700",
                    "votes": 5,
                    "category": "dexterity",
                    "owner": "grumpy19",
                    "created_at": "2021-01-18T10:01:41.251Z"
                }
            }
        },
        "GET /api/reviews/:review_id/comments": {
            "description": "responds with JSON containing an array of comments assosciated with the given review_id",
            "queries": [],
            "exampleResponse": {
                "comments": [
                    {
                        "comment_id": 10,
                        "votes": 9,
                        "created_at": "2021-03-27T14:15:31.110Z",
                        "author": "grumpy19",
                        "body": "Ex id ipsum dolore non cillum anim sint duis nisi anim deserunt nisi minim.",
                        "review_id": 2
                    },
                    {
                        "comment_id": 1,
                        "votes": 16,
                        "created_at": "2017-11-22T12:36:03.389Z",
                        "author": "happyamy2016",
                        "body": "I loved this game too!",
                        "review_id": 2
                    },
                    {
                        "comment_id": 4,
                        "votes": 16,
                        "created_at": "2017-11-22T12:36:03.389Z",
                        "author": "tickle122",
                        "body": "EPIC board game!",
                        "review_id": 2
                    }
                ]
            }
        },
        "GET /api/users": {
            "description": "responds with a JSON containing an array of users",
            "queries": [],
            "exampleResponse": {
                "users": [
                    {
                        "username": "tickle122",
                        "name": "Tom Tickle",
                        "avatar_url": "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953"
                    }
                ]
            }
        },
        "PATCH /api/reviews/:review_id": {
            "description": "updates votes on a review by specified amount",
            "queries": [],
            "request_body": {
                "inc_votes": "number to increase or decrease votes by"
            },
            "exampleResponse": {
                "review": {
                    title: 'Agricola',
                    designer: 'Uwe Rosenberg',
                    owner: 'mallionaire',
                    review_img_url:
                        'https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700',
                    review_body: 'Farmyard fun!',
                    category: 'euro game',
                    created_at: "2021-01-18T10:00:20.514Z",
                    votes: 5
                }
            }
        },
        "POST /api/reviews/:review_id/comments": {
            "description": "Inserts a new comment into the comments table from a body and user given in the request",
            "queries": [],
            "request_body": {
                "username": "username the comment is associated with",
                "body": "body of the comment"
            },
            "exampleResponse": {
                "comment": {
                    comment_id: 7,
                    body: "What a fun game!",
                    review_id: 1,
                    author: "mallionaire",
                    votes: 0,
                    created_at: "2023-04-25T12:07:42Z"
                }
            }
        },
        "DELETE /api/comments/:comment_id": {
            "description": "deletes a specific comment according to comment_id",
            "queries": [],
            "response": "No content, 204 status code"
        }
    }
}

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

module.exports = { fetchEndpoints, fetchCategories, fetchReviews, postingComment, fetchReviewID, fetchReviewComments, updateVotes, fetchUsers, removeComment }