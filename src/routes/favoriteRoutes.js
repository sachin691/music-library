const express = require("express");
const { getFavorites, addFavorite, removeFavorite } = require("../controllers/favoriteController"); // Import controller
const authenticate = require("../middlewares/isAuthenticated"); // Authentication middleware
const router = express.Router();

router.get("/:category", authenticate, getFavorites); // GET route for retrieving favorites
router.post("/add-favorite", authenticate, addFavorite);
router.delete("/remove-favorite/:id", authenticate, removeFavorite);


module.exports = router;
