const { app } = require("../app.js");
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
    test("status:400, responds with an error message when passed a username that doesn't exist in the database", () => {
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
    test("status:400 responds with an error message when not given a valid review_id", () => {
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