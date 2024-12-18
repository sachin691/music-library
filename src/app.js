const express = require("express");
const sequelize = require("./config/index");
const cors = require("cors");
const passport = require("passport");
const db = require("./config");
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
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Passport.js for authentication
app.use(passport.initialize());
app.use(requestLogger);

db.authenticate()
  .then(() => console.log("Database connection has been established successfully."))
  .catch((err) => console.error("Unable to connect to the database:", err));

require("./models");

// Set up routes
const baseUrl = process.env.BASE_URL;

app.get("/api/v1", (req, res) => {
  res.json({
    message: "Welcome to the Music Management Library API",
    status: "live",
    version: "1.0.0",
  });
});

// Combine both routes into one line
app.use(baseUrl + "/", authRoutes);
app.use(baseUrl + "/users", userRoutes);
app.use(baseUrl + "/artists", artistRoutes);
app.use(baseUrl + "/albums", albumRoutes);
app.use(baseUrl + "/tracks", trackRoutes);
app.use(baseUrl + "/favorite", favoriteRoutes);
app.use(baseUrl + "/followers", userFollowRoutes);
app.use(baseUrl + "/playlist", playlistRoutes);

app.use(errorHandler);
module.exports = app;
