// src/app.js
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const { successResponse, errorResponse } = require("./utils/responseUtil");
const db = require("./config"); // Import database config for connection check
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const artistRoutes = require("./routes/artistRoutes");
const albumRoutes = require("./routes/albumRoutes");
const trackRoutes = require("./routes/trackRoutes");
const errorHandler = require("./middlewares/errorHandler");

// Initialize the Express app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// Initialize Passport.js for authentication
app.use(passport.initialize());

// Set up routes
// app.use("/auth", authRoutes);
// app.use("/users", userRoutes);
// app.use("/artists", artistRoutes);
// app.use("/albums", albumRoutes);
// app.use("/tracks", trackRoutes);

// Centralized error handler (for any unhandled routes or errors)
// app.use(errorHandler);

// Test the database connection at the start
db.authenticate()
  .then(() => console.log("Database connection has been established successfully."))
  .catch((err) => console.error("Unable to connect to the database:", err));

// Export the app for use in server.js
module.exports = app;
