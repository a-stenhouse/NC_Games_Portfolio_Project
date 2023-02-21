const db = require("./db/connection.js");

function fetchCategories() {
    return db.query(`SELECT * FROM categories;`)
        .then((result) => result.rows);
};





module.exports = { fetchCategories }