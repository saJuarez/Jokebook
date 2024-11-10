"use strict";
const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/categories-controller");

// http://localhost:3000/jokebook/categories
router.get('/categories', categoriesController.getAll); // Route to get all categories
// http://localhost:3000/jokebook/search/programming
router.get("/search/:category", categoriesController.searchOrAddCategory); // Route for searching or
                                                                 // adding a new category with jokes

module.exports = router;