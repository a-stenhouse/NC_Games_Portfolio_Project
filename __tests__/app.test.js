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