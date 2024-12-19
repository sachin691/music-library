const express = require("express");
const { getFavorites, addFavorite, removeFavorite } = require("../controllers/favoriteController");
const authenticate = require("../middlewares/isAuthenticated");
const router = express.Router();

router.get("/:category", authenticate, getFavorites);
router.post("/add-favorite", authenticate, addFavorite);
router.delete("/remove-favorite/:id", authenticate, removeFavorite);

module.exports = router;
