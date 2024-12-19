const express = require("express");
const { getAllAlbums, getAlbumById, addAlbum, updateAlbum, deleteAlbum } = require("../controllers/albumController");
const authenticate = require("../middlewares/isAuthenticated");
const isAdmin = require("../middlewares/isAdmin");

const router = express.Router();

router.get("/", authenticate, getAllAlbums);
router.get("/:id", authenticate, getAlbumById);
router.post("/add-album", authenticate, isAdmin, addAlbum);
router.put("/:id", authenticate, updateAlbum);
router.delete("/:id", authenticate, deleteAlbum);

module.exports = router;
