"use strict";
const jokesModel = require("../models/jokes-model");
const categoriesModel = require("../models/categories-model");

// Get jokes by category with optional limit
async function getJokesByCategory(req, res, next) {
    try {
        const category = req.params.category;
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;

        // Validate category
        const categories = await categoriesModel.getAll();
        const categoryExists = categories.some(cat => cat.name === category);

        if (!categoryExists) {
            return res.status(404).json({ error: `Category '${category}' not found.` });
        }

        // Fetch jokes with optional limit
        const jokes = await jokesModel.getJokesByCategory(category, limit);
        res.json({ jokes });
    } catch (err) {
        console.error("Error while getting jokes by category:", err.message);
        next(err);
    }
}

// Add a joke to the database
async function addJoke(req, res, next) {
    try {
        const { category, setup, delivery } = req.body;

        if (!category || !setup || !delivery) {
            return res.status(400).json({ error: "Missing required parameters: category, setup, and delivery." });
        }

        // Check if category exists
        const categories = await categoriesModel.getAll();
        const categoryData = categories.find(cat => cat.name === category);

        if (!categoryData) {
            return res.status(404).json({ error: `Category '${category}' not found.` });
        }

        // Add the joke to the database
        await jokesModel.addJoke(categoryData.id, setup, delivery);

        // Fetch updated jokes for the category
        const updatedJokes = await jokesModel.getJokesByCategory(category);
        res.json({ jokes: updatedJokes });
    } catch (err) {
        console.error("Error while adding a joke:", err.message);
        next(err);
    }
}

module.exports = { getJokesByCategory, addJoke };