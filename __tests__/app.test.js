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
                expect(response.body).toEqual({ msg: "Not a valid review ID, must be a number" })
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
                expect(response.body.msg).toBe("Not a valid review ID, must be a number")
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
                    created_at: "2023-02-23T11:11:46.000Z"
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
                    created_at: "2023-02-23T11:11:46.000Z"
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
                expect(response.body.msg).toBe("Not a valid review ID, must be a number")
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