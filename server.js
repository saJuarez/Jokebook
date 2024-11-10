"use strict";
const express = require("express");
const path = require("path");  
const app = express();

app.use(express.static(path.join(__dirname, 'views')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Import routes
const categoriesRoutes = require('./routes/categories-routes');
const jokesRoutes = require('./routes/jokes-routes');

// Register routes
app.use('/jokebook', categoriesRoutes);
app.use('/jokebook', jokesRoutes);  

// Route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, function () {
  console.log("App listening at http://localhost:" + PORT);
});

// Graceful shutdown
process.on("SIGINT", cleanUp);
process.on("SIGTERM", cleanUp);

function cleanUp() {
  console.log("Terminate signal received.");
  console.log("...Closing HTTP server.");
  server.close(() => {
    console.log("...HTTP server closed.");
    process.exit(0); 
  });
}