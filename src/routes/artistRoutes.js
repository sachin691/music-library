const express = require("express");
const router = express.Router();
const {
  getAllArtists,
  getArtistById,
  addArtist,
  updateArtist,
  deleteArtist,
} = require("../controllers/artistController");
const authenticate = require("../middlewares/isAuthenticated");
const isAdmin = require("../middlewares/isAdmin");

router.get("/", authenticate, getAllArtists);
router.get("/:id", authenticate, getArtistById);
router.post("/add-artist", authenticate, isAdmin, addArtist);
router.put("/:id", authenticate, updateArtist);
router.delete("/:id", authenticate, deleteArtist);
module.exports = router;
