const express = require("express");
const { signup } = require("../controllers/userController");
const validate = require("../middlewares/validate");
const { body } = require("express-validator");

const router = express.Router();

// Validation rules for creating a user
const userValidationRules = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];

// Routes
router.post("/signup", validate(userValidationRules), signup);

module.exports = router;
