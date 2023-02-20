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
                expect(res.body).toEqual({
                    categories: [
                        { slug: 'euro game', description: 'Abstact games that involve little luck' },
                        {
                            slug: 'social deduction',
                            description: "Players attempt to uncover each other's hidden role"
                        },
                        { slug: 'dexterity', description: 'Games involving physical skill' },
                        { slug: "children's games", description: 'Games suitable for children' }
                    ]
                })
            })
    })
})