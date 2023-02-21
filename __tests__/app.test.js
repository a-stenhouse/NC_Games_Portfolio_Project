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

describe.only("get /api/reviews", () => {
    test.only("responds with JSON containing an array of reviews with key of reviews", () => {
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