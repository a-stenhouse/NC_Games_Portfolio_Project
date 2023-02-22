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
            .then((res) => {
                res.body.categories.forEach((category) => {
                    expect(category).toMatchObject({
                        description: expect.any(String),
                        slug: expect.any(String)
                    })
                })
                expect(res.body.categories.length).toBe(4);
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
                    title: expect.any(String),
                    review_body: expect.any(String),
                    designer: expect.any(String),
                    review_img_url: expect.any(String),
                    votes: expect.any(Number),
                    category: expect.any(String),
                    owner: expect.any(String),
                    created_at: expect.any(String)
                })
            })
    });
    test("status:400, responds with an error message when passed a bad review ID", () => {
        return request(app)
            .get("/api/reviews/notanID")
            .expect(400)
            .then((response) => {
                expect(response.body).toEqual({ msg: "Not a valid user ID" })
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