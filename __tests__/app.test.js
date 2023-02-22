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

describe("get /api/reviews/:review_id/comments", () => {
    test("responds with JSON containig an array of comments assosciated with the given review_id", () => {
        return request(app)
            .get("/api/reviews/3/comments")
            .expect(200)
            .then((response) => {
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
    test("status:404, responds with an error message when no comments are found with the given review_id", () => {
        return request(app)
            .get("/api/reviews/1/comments")
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe("No comments found with review_id: 1")
            })
    });
    test("status:400, reponds with an error message when passed a bad review_id", () => {
        return request(app)
            .get("/api/reviews/notAReviewID/comments")
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("Bad request")
            })
    })
})