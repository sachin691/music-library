const express = require("express");
const { getAllTracks, getTrackById, addTrack } = require("../controllers/trackController"); // Import controller
const authenticate = require("../middlewares/isAuthenticated");
const router = express.Router();

router.get("/", authenticate, getAllTracks); // GET route for retrieving all tracks
router.get('/:track_id', authenticate, getTrackById); // GET route for retrieving a single track
router.post('/add-track', authenticate, addTrack); // POST route for adding a new track
module.exports = router;
