const express = require("express");
const { getAllAlbums } = require("../controllers/albumController");
const authenticate = require("../middlewares/isAuthenticated");

const router = express.Router();

router.get("/", authenticate, getAllAlbums); // GET /albums endpoint

module.exports = router;
