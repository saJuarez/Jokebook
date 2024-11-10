"use strict";
const Database = require("better-sqlite3");
const db = new Database("./models/jokebook.db", { fileMustExist: true });

// Get all categories
function getAll() {
    const sql = "SELECT * FROM categories";
    const rows = db.prepare(sql).all();
    return rows;
}

// Add new category
function addCategory(name) {
    const sql = "INSERT INTO categories (name) VALUES (?)";
    const result = db.prepare(sql).run(name);
    return result.lastInsertRowid;
}

module.exports = { getAll, addCategory };