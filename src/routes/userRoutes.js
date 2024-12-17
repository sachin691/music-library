const express = require("express");
const router = express.Router();
const { getUsers, addUser, deleteUser } = require("../controllers/userController");
const isAdmin = require("../middlewares/isAdmin");
const authenticate = require("../middlewares/isAuthenticated");
// Define the route for retrieving users
router.get("/users", authenticate, isAdmin, getUsers);
router.post("/add-user", authenticate, isAdmin, addUser);
router.delete("/users/:id", authenticate, isAdmin, deleteUser);

module.exports = router;
