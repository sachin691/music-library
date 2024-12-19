// src/app.js
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const db = require("./config"); // Import database config for connection check
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const artistRoutes = require("./routes/artistRoutes");
const albumRoutes = require("./routes/albumRoutes");
const trackRoutes = require("./routes/trackRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const userFollowRoutes = require("./routes/userFollowRoutes");
const playlistRoutes = require("./routes/playlistRoutes");

const errorHandler = require("./middlewares/errorHandler");
const requestLogger = require("./middlewares/requestLogger");
require("./config/passport");
// Initialize the Express app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// Initialize Passport.js for authentication
app.use(passport.initialize());
app.use(requestLogger);

db.authenticate()
  .then(() => console.log("Database connection has been established successfully."))
  .catch((err) => console.error("Unable to connect to the database:", err));

// Set up routes
const baseUrl = process.env.BASE_URL;

// Combine both routes into one line
app.use(baseUrl + "/", authRoutes);
app.use(baseUrl + "/users", userRoutes);
app.use(baseUrl + "/artists", artistRoutes);
app.use(baseUrl + "/albums", albumRoutes);
app.use(baseUrl + "/tracks", trackRoutes);
app.use(baseUrl + "/favorite", favoriteRoutes);
app.use(baseUrl + "/followers", userFollowRoutes);
app.use(baseUrl + "/playlist", playlistRoutes);





// Centralized error handler (for any unhandled routes or errors)
app.use(errorHandler);

// Test the database connection at the start


// Export the app for use in server.js
module.exports = app;
