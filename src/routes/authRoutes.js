const express = require("express");
const { signup, login, logout } = require("../controllers/authController");
const authenticate = require("../middlewares/isAuthenticated")
const validate = require("../middlewares/validate");
const { body } = require("express-validator");

const router = express.Router();

// Validation rules for creating a user
const userValidationRules = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];

const loginValidationRules = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Routes
router.post("/signup", validate(userValidationRules), signup);
router.post("/login", validate(loginValidationRules), login);
router.get("/logout", authenticate, logout); 

module.exports = router;
