const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");

afterAll(() => {
    return db.end()
});
beforeEach(() => {
    return seed(data)
});

describe("get /api/categories", () => {
    test("responds with JSON containing an array of category objects with a key of 'categories'", () => {
        return request(app)
            .get("/api/categories")
            .expect(200)
            .then((response) => {
                response.body.categories.forEach((category) => {
                    expect(category).toMatchObject({
                        description: expect.any(String),
                        slug: expect.any(String)
                    })
                })
                expect(response.body.categories.length).toBe(4);
            })
    })
})

describe("get /api/reviews/review_id", () => {
    test("responds with JSON containing the expected review according to the review ID", () => {
        return request(app)
            .get("/api/reviews/1")
            .expect(200)
            .then((response) => {
                expect(response.body.review).toMatchObject({
                    review_id: 1,
                    title: "Agricola",
                    review_body: 'Farmyard fun!',
                    designer: 'Uwe Rosenberg',
                    review_img_url: 'https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700',
                    votes: 1,
                    category: 'euro game',
                    owner: 'mallionaire',
                    created_at: "2021-01-18T10:00:20.514Z"
                })
            })
    });
    test("status:400, responds with an error message when passed a bad review ID", () => {
        return request(app)
            .get("/api/reviews/notanID")
            .expect(400)
            .then((response) => {
                expect(response.body).toEqual({ msg: "Not a valid ID, must be a number" })
            })
    })
    test("status:404, responds with an error message when passed a review ID that doesn't exist", () => {
        return request(app)
            .get("/api/reviews/5432534")
            .expect(404)
            .then((response) => {
                expect(response.body).toEqual({ msg: "No review found with review_id: 5432534" })
            })
    })
})

describe("get /api/reviews", () => {
    test("responds with JSON containing an array of reviews with key of reviews", () => {
        return request(app)
            .get("/api/reviews")
            .expect(200)
            .then((response) => {
                response.body.reviews.forEach((review) => {
                    expect(review).toMatchObject({
                        owner: expect.any(String),
                        title: expect.any(String),
                        review_id: expect.any(Number),
                        category: expect.any(String),
                        review_img_url: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        designer: expect.any(String),
                        comment_count: expect.any(Number)
                    })
                })
            })
    })
    test("responds with JSON containing an array of reviews that belong to a category specified in a query", () => {
        return request(app)
            .get("/api/reviews?category=social%20deduction")
            .expect(200)
            .then((response) => {
                expect(response.body.reviews.length).toBe(11)
                response.body.reviews.forEach((review) => {
                    expect(review).toMatchObject({
                        owner: expect.any(String),
                        title: expect.any(String),
                        review_id: expect.any(Number),
                        category: "social deduction",
                        review_img_url: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        designer: expect.any(String),
                        comment_count: expect.any(Number)
                    })
                })
            })
    })
    test("responds with JSON containing reviews sorted in the correct way according to the query", () => {
        return request(app)
            .get("/api/reviews?sortBy=review_id&sortOrder=ASC")
            .expect(200)
            .then((response) => {
                expect(response.body.reviews.length).toBe(13)
                response.body.reviews.forEach((review, index) => {
                    expect(review).toMatchObject({
                        owner: expect.any(String),
                        title: expect.any(String),
                        review_id: index + 1,
                        category: expect.any(String),
                        review_img_url: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        designer: expect.any(String),
                        comment_count: expect.any(Number)
                    })
                })
            })
    })
})

describe("patch /api/reviews/:reviewid", () => {
    test("responds with a JSON containing the updated review", () => {
        return request(app)
            .patch("/api/reviews/1")
            .send({ inc_votes: 4 })
            .expect(200)
            .then((reponse) => {
                expect(reponse.body.review).toMatchObject({
                    title: 'Agricola',
                    designer: 'Uwe Rosenberg',
                    owner: 'mallionaire',
                    review_img_url:
                        'https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700',
                    review_body: 'Farmyard fun!',
                    category: 'euro game',
                    created_at: "2021-01-18T10:00:20.514Z",
                    votes: 5
                })
            })
    })
    test("status:400, if decrementing votes would result in votes being less than zero, rejects this query", () => {
        return request(app)
            .patch("/api/reviews/1")
            .send({ inc_votes: -4 })
            .expect(400)
            .then((response) => {
                expect(response.body).toEqual({ msg: "Cannot decrement votes below zero" })
            })
    })
    test("status:404, if passed a review_id that doesn't exist, rejects query", () => {
        return request(app)
            .patch("/api/reviews/100")
            .send({ inc_votes: 4 })
            .expect(404)
            .then((response) => {
                expect(response.body).toEqual({ msg: "Review_id does not exist" })
            })
    })
    test("status:400, if passed an invalid review_id, rejects query", () => {
        return request(app)
            .patch("/api/reviews/notAValidID")
            .send({ inc_votes: 4 })
            .expect(400)
            .then((response) => {
                expect(response.body).toEqual({ msg: "Not a valid review_id / no. of votes" })
            })
    })
    test("status:400, rejects query if not passed a valid request body", () => {
        return request(app)
            .patch("/api/reviews/1")
            .send({ inc_votes: "four" })
            .expect(400)
            .then((response) => {
                expect(response.body).toEqual({ msg: "Not a valid review_id / no. of votes" })
            })
    })
})

describe("get /api/reviews/:review_id/comments", () => {
    test("responds with JSON containing an array of comments assosciated with the given review_id", () => {
        return request(app)
            .get("/api/reviews/3/comments")
            .expect(200)
            .then((response) => {
                expect(response.body.comments.length).toBe(3)
                response.body.comments.forEach((comment) => {
                    expect(comment).toMatchObject({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        review_id: 3,
                    })
                })
            })
    })
    test("responds with JSON containing an empty array if called for a valid review with zero comments", () => {
        return request(app)
            .get("/api/reviews/1/comments")
            .expect(200)
            .then((response) => {
                expect(response.body.comments).toEqual([])
            })
    })
    test("status:404, responds with an error message when a review_id that doesn't exist is called", () => {
        return request(app)
            .get("/api/reviews/100/comments")
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe("No review found with review_id: 100")
            })
    });
    test("status:400, reponds with an error message when passed a bad review_id", () => {
        return request(app)
            .get("/api/reviews/notAReviewID/comments")
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("Not a valid ID, must be a number")
            })
    })
})

describe("post /api/reviews/:review_id/comments", () => {
    test("Inserts a new comment into the comments table from a body and user given in the request", () => {
        const comment = {
            username: "mallionaire",
            body: "What a fun game!"
        }
        return request(app)
            .post("/api/reviews/1/comments")
            .send(comment)
            .expect(201)
            .then((response) => {
                expect(response.body.comment).toMatchObject({
                    comment_id: 7,
                    body: "What a fun game!",
                    review_id: 1,
                    author: "mallionaire",
                    votes: 0,
                    created_at: expect.any(String)
                })
            })
    })
    test("Inserts a new valid comment while ignoring unecessary properties", () => {
        const comment = {
            username: "mallionaire",
            body: "What a fun game!",
            fav_colour: "blue",
            age: 25
        }
        return request(app)
            .post("/api/reviews/1/comments")
            .send(comment)
            .expect(201)
            .then((response) => {
                expect(response.body.comment).toMatchObject({
                    comment_id: 7,
                    body: "What a fun game!",
                    review_id: 1,
                    author: "mallionaire",
                    votes: 0,
                    created_at: expect.any(String)
                })
            })
    })
    test("status:400, responds with an error message when passed a malformed body", () => {
        return request(app)
            .post("/api/reviews/1/comments")
            .send({})
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("Malformed body / missing required fields")
            })
    })
    test("status:404, responds with an error message when passed a username that doesn't exist in the database", () => {
        const comment = {
            username: "arran",
            body: "What a fun game!"
        }
        return request(app)
            .post("/api/reviews/1/comments")
            .send(comment)
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe("Username does not exist in database")
            })
    })
    test("status:400 responds with an error message when not given a valid review_id", () => {
        const comment = {
            username: "mallionaire",
            body: "What a fun game!"
        }
        return request(app)
            .post("/api/reviews/NotAReviewID/comments")
            .send(comment)
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("Not a valid ID, must be a number")
            })
    })
    test("status:404 responds with an error message when not given a valid review_id", () => {
        const comment = {
            username: "mallionaire",
            body: "What a fun game!"
        }
        return request(app)
            .post("/api/reviews/200/comments")
            .send(comment)
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe("Review_id does not exist in database")
            })
    })
})

describe("get /api/users", () => {
    test("responds with a JSON containing the expected number of users and properties", () => {
        return request(app)
            .get("/api/users")
            .expect(200)
            .then((response) => {
                expect(response.body.users.length).toBe(4)
                response.body.users.forEach((user) => {
                    expect(user).toMatchObject({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    })
                })
            })
    })
})

describe("delete /api/comments/:comment_id", () => {
    test("should delete the comment and respond with a 204 status", () => {
        return request(app)
            .delete("/api/comments/3")
            .expect(204)
    })
    test("status:400 should respond with an error message when passed an invalid comment_id", () => {
        return request(app)
            .delete("/api/comments/notanID")
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("Not a valid ID, must be a number")
            })
    })
    test("status:404 should respond with an error message when passed a comment_id that doesn't exist", () => {
        return request(app)
            .delete("/api/comments/99999")
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe("No comment found with comment_id: 99999")
            })
    })
})

describe("get /api", () => {
    test("should respond with a JSON containing all endpoints and a 200 status", () => {
        return request(app)
            .get("/api")
            .expect(200)
            .then((response) => {
                expect(response.body.endpoints).toMatchObject({
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
                })
            })
    })
})