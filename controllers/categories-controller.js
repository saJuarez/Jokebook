"use strict";
const categoriesModel = require("../models/categories-model");
const jokesModel = require("../models/jokes-model");

// Get all categories
async function getAll(req, res, next) {
    try {
        const categoriesList = await categoriesModel.getAll();
        res.json({ categories: categoriesList });
    } catch (err) {
        console.error("Error while getting categories:", err.message);
        next(err);
    }
}

// Search for a category in the external API. Give option to add it to the database
async function searchOrAddCategory(req, res, next) {
    try {
        const category = req.params.category;

        // Check if category already exists
        const existingCategories = await categoriesModel.getAll();
        const categoryExists = existingCategories.some(cat => cat.name.toLowerCase() === category.toLowerCase());

        if (categoryExists) {
            return res.status(200).json({ message: `Category '${category}' already exists.` });
        }

        // Fetch some sample jokes from the external API
        const apiUrl = `https://v2.jokeapi.dev/joke/${encodeURIComponent(category)}?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=twopart&amount=3`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.error || !data.jokes || data.jokes.length === 0) {
            return res.status(404).json({ message: `No jokes found for category '${category}' in external API.` });
        }

        // Add new category to the relational database
        const categoryId = await categoriesModel.addCategory(category);

        // Add new jokes to the relational database
        for (const joke of data.jokes) {
            await jokesModel.addJoke(categoryId, joke.setup, joke.delivery);
        }

        res.status(201).json({ message: `Category '${category}' and jokes added successfully.`, jokes: data.jokes });
    } catch (err) {
        console.error("Error in searchOrAddCategory:", err.message);
        next(err);
    }
}

module.exports = { getAll, searchOrAddCategory };