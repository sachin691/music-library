const express = require("express");
const { getAllTracks, getTrackById, addTrack, deleteTrack } = require("../controllers/trackController"); // Import controller
const authenticate = require("../middlewares/isAuthenticated");
const isAdmin = require("../middlewares/isAdmin");
const router = express.Router();

router.get("/", authenticate, getAllTracks); // GET route for retrieving all tracks
router.get('/:track_id', authenticate, getTrackById); // GET route for retrieving a single track
router.post('/add-track',authenticate, isAdmin, addTrack); // POST route for adding a new track
router.delete('/:id',authenticate, deleteTrack); // DELETE route for deleting a track


module.exports = router;
