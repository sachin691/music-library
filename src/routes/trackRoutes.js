const express = require("express");
const { getAllTracks, getTrackById, addTrack, deleteTrack } = require("../controllers/trackController"); // Import controller
const authenticate = require("../middlewares/isAuthenticated");
const isAdmin = require("../middlewares/isAdmin");
const router = express.Router();

router.get("/", authenticate, getAllTracks);
router.get("/:track_id", authenticate, getTrackById);
router.post("/add-track", authenticate, isAdmin, addTrack);
router.delete("/:id", authenticate, deleteTrack);

module.exports = router;
