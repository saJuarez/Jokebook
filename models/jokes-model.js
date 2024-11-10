"use strict";
const Database = require("better-sqlite3");
const db = new Database("./models/jokebook.db", { fileMustExist: true });

// Get jokes by category with an optional limit
function getJokesByCategory(category, limit) {
    return new Promise((resolve, reject) => {
        let sql = `
            SELECT jokes.setup, jokes.delivery 
            FROM jokes 
            JOIN categories ON jokes.category_id = categories.id 
            WHERE categories.name = ?
        `;
        if (limit) {
            sql += ` LIMIT ${limit}`;  // Append limit to the query
        }

        try {
            const rows = db.prepare(sql).all(category);
            resolve(rows);
        } catch (err) {
            console.error("Error executing query:", err.message);
            reject(err);
        }
    });
}

// Add a joke to the database for a given category
function addJoke(categoryId, setup, delivery) {
    try {
        const sql = `
            INSERT INTO jokes (category_id, setup, delivery)
            VALUES (?, ?, ?)
        `;
        db.prepare(sql).run(categoryId, setup, delivery);
    } catch (err) {
        console.error("Error inserting joke:", err.message);
        throw err;
    }
}

module.exports = { getJokesByCategory, addJoke };