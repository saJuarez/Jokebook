"use strict";
const express = require("express");
const router = express.Router();
const jokesController = require('../controllers/jokes-controller');

// http://localhost:3000/jokebook/jokes 
router.get('/jokes', jokesController.getJokesByCategory); // Route to get all jokes

// http://localhost:3000/jokebook/joke/funnyJoke?limit=2
router.get('/joke/:category', jokesController.getJokesByCategory); // Route to get jokes by category
                                                                   // with an optional limit
// http://localhost:3000/jokebook/joke/new
router.post('/joke/new', jokesController.addJoke); // Add a joke


module.exports = router;