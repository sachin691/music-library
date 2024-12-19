const express = require("express");
const {
  createPlaylist,
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  getTracksInPlaylist,
} = require("../controllers/playlistController");
const authenticate = require("../middlewares/isAuthenticated");

const router = express.Router();

// Route to create a new playlist
router.post("/create", authenticate, createPlaylist);

// Route to add a track to a playlist
router.post("/add-track", authenticate, addTrackToPlaylist);

// Route to remove a track from a playlist
router.delete("/remove-track/:playlist_id/:track_id", authenticate, removeTrackFromPlaylist);

// Route to get all tracks in a playlist
router.get("/tracks/:playlist_id", authenticate, getTracksInPlaylist);

module.exports = router;
