const express = require("express");
const router = express.Router();
const { getUsers, addUser, deleteUser, updatePassword } = require("../controllers/userController");
const isAdmin = require("../middlewares/isAdmin");
const authenticate = require("../middlewares/isAuthenticated");

router.get("/", authenticate, isAdmin, getUsers);
router.post("/add-user", authenticate, isAdmin, addUser);
router.delete("/:id", authenticate, isAdmin, deleteUser);
router.put("/update-password", authenticate, updatePassword);

module.exports = router;
