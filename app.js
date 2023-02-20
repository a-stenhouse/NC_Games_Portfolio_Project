const express = require('express');
const app = express();
const { getCategories } = require("./controller.js")


app.get("/api/categories", getCategories)

app.use((err, req, res, next) => {
    res.status(500).send("Server Error!")
})

module.exports = { app };