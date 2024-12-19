const express = require("express");
const { followArtist, unFollowArtist, getFollowings } = require("../controllers/userFollowController"); // Import controller
const authenticate = require("../middlewares/isAuthenticated"); // Authentication middleware
const router = express.Router();

// Route to follow an artist
router.post("/follow-artist", authenticate, followArtist);

// Route to unfollow an artist
router.delete("/unfollow-artist/:artist_id", authenticate, unFollowArtist);

// Route to get the list of followings with optional filters
router.get("/", authenticate, getFollowings);

module.exports = router;
