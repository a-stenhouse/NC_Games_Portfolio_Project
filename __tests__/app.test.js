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