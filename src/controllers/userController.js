const { User } = require("../models");
const bcrypt = require("bcryptjs");
const { STATUS_CODES } = require("../utils/constants");
const { AppError } = require("../utils/errors");
const initializeDefaultOrganization = require("../utils/initOrganization");

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(STATUS_CODES.CONFLICT).json({
        status: STATUS_CODES.CONFLICT,
        data: null,
        message: "Email already exists.",
        error: null,
      });
    }

    // Check if this is the first user
    const userCount = await User.count();
    let organizationId;

    if (userCount === 0) {
      // Initialize default organization for the first user
      const defaultOrg = await initializeDefaultOrganization();
      organizationId = defaultOrg.id;
    } else {
      // Return error if organization ID is required for subsequent users
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        status: STATUS_CODES.BAD_REQUEST,
        data: null,
        message: "Bad Request, Reason: Organization ID is required.",
        error: null,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    await User.create({
      email,
      password: hashedPassword,
      role: userCount === 0 ? "admin" : "viewer",
      organization_id: organizationId,
    });

    // Send success response for user creation
    return res.status(STATUS_CODES.CREATED).json({
      status: STATUS_CODES.CREATED,
      data: null,
      message: "User created successfully.",
      error: null,
    });
  } catch (error) {
    // Handle any unexpected errors
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      data: null,
      message: error.message || "Internal Server Error",
      error: error.stack,
    });
  }
};

module.exports = { signup };
