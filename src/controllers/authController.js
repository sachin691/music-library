const User = require("../models/User");
const Organization = require("../models/Organization");
const { STATUS_CODES, ROLES } = require("../utils/constants");
const initializeDefaultOrganization = require("../utils/initOrganization");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { email, password, organization_id } = req.body;

    if (!email || !password) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        status: STATUS_CODES.BAD_REQUEST,
        data: null,
        message: `Bad Request, Reason: ${!email ? "Email" : "Password"} is required.`,
        error: null,
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        status: STATUS_CODES.BAD_REQUEST,
        data: null,
        message: "User with this email already exists.",
        error: null,
      });
    }

    let organizationId;
    let role = ROLES.VIEWER; 

    if (organization_id) {
      // Organization ID provided in request body
      const organizationExists = await Organization.findByPk(organization_id);
      if (!organizationExists) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          status: STATUS_CODES.BAD_REQUEST,
          data: null,
          message: "Organization with this ID does not exist.",
          error: null,
        });
      }

      // Check if there are users in the given organization
      const organizationUserCount = await User.count({ where: { organization_id } });
      role = organizationUserCount === 0 ? ROLES.ADMIN : ROLES.VIEWER;

      organizationId = organization_id;
    } else {
      // No organization ID provided
      const organizationCount = await Organization.count();

      if (organizationCount === 0) {
        // If no organizations exist, initialize the default organization
        const defaultOrg = await initializeDefaultOrganization();
        organizationId = defaultOrg.id;
        role = ROLES.ADMIN; // First user becomes admin
      } else {
        // Get the first organization from the table and add the user to it
        const firstOrganization = await Organization.findOne({ order: [["createdAt", "ASC"]] });
        organizationId = firstOrganization.id;
        role = ROLES.VIEWER; // Default role for users in an existing organization
      }
    }

    // Hash the password using User model's static method
    const hashedPassword = await User.hashPassword(password);

    // Create the new user
    const user = await User.create({
      email,
      password: hashedPassword, // Store the hashed password
      organization_id: organizationId, // Link the user to the appropriate organization
      role, // Assign the role (admin or viewer)
    });

    return res.status(STATUS_CODES.CREATED).json({
      status: STATUS_CODES.CREATED,
      data: { user },
      message: "User created successfully.",
      error: null,
    });
  } catch (error) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      data: null,
      message: error.message || "Internal server error",
      error: null,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        status: STATUS_CODES.BAD_REQUEST,
        data: null,
        message: `Bad Request, Reason: ${!email ? "Email" : "Password"} is required.`,
        error: null,
      });
    }

    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        status: STATUS_CODES.NOT_FOUND,
        data: null,
        message: "User not found.",
        error: null,
      });
    }

    const isMatch = await User.comparePassword(password, user.password);
    console.log(isMatch);
    if (!isMatch) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        status: STATUS_CODES.BAD_REQUEST,
        data: null,
        message: "Invalid credentials.",
        error: null,
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expiry time (1 hour)
    });

    return res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      data: { token },
      message: "Login successful.",
      error: null,
    });
  } catch (error) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      data: null,
      message: error.message || "Internal server error",
      error: null,
    });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        status: STATUS_CODES.BAD_REQUEST,
        data: null,
        message: "Bad Request",
        error: "Authorization token missing",
      });
    }

    return res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      data: null,
      message: "User logged out successfully.",
      error: null,
    });
  } catch (error) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      data: null,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { signup, login, logout };
