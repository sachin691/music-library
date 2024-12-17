const { User } = require("../models"); // Assuming you're using Sequelize or similar ORM
const { STATUS_CODES } = require("../utils/constants");
const { Op } = require("sequelize");

// Function to retrieve all users
const getUsers = async (req, res) => {
  try {
    // Ensure the user is authenticated
    if (!req.user) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        status: STATUS_CODES.UNAUTHORIZED,
        data: null,
        message: "Unauthorized Access",
        error: null,
      });
    }

    // Get query parameters
    const { limit = 5, offset = 0, role } = req.query;

    // Ensure limit and offset are integers
    const limitInt = parseInt(limit, 10);
    const offsetInt = parseInt(offset, 10);

    // Get the organization ID of the logged-in user (req.user contains logged-in user info)
    const { organization_id, id } = req.user;
    console.log(organization_id, id);

    // Build query options for filtering and pagination
    const queryOptions = {
      where: {
        organization_id, // Ensure users belong to the same organization
        id: { [Op.ne]: id }, // Exclude the logged-in user (admin)
        ...(role && { role }), // Filter by role if provided (e.g., Editor, Viewer)
      },
      limit: limitInt,
      offset: offsetInt,
    };

    // Fetch users from the database, excluding the admin (logged-in user)
    const users = await User.findAll(queryOptions);

    console.log("users ==> ", users);

    if (users.length === 0) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        status: STATUS_CODES.BAD_REQUEST,
        data: null,
        message: "No users found",
        error: null,
      });
    }

    return res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      data: users,
      message: "Users retrieved successfully.",
      error: null,
    });
  } catch (err) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      data: null,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

const addUser = async (req, res) => {
  try {
    // Ensure the user is authenticated (this is handled by the 'authenticate' middleware)
    // Ensure the user is an Admin (this is handled by the 'isAdmin' middleware)

    // Get user input from the request body
    const { email, password, role } = req.body;

    // Validate input
    if (!email || !password || !role) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        status: STATUS_CODES.BAD_REQUEST,
        data: null,
        message: "Bad Request: Missing required fields",
        error: null,
      });
    }

    // Validate role (can only be 'editor' or 'viewer')
    if (role === "admin") {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        status: STATUS_CODES.FORBIDDEN,
        data: null,
        message: "Forbidden Access: Cannot assign 'admin' role",
        error: null,
      });
    }

    if (!["editor", "viewer"].includes(role)) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        status: STATUS_CODES.BAD_REQUEST,
        data: null,
        message: "Bad Request: Invalid role. Only 'editor' or 'viewer' are allowed",
        error: null,
      });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(STATUS_CODES.CONFLICT).json({
        status: STATUS_CODES.CONFLICT,
        data: null,
        message: "Email already exists.",
        error: null,
      });
    }

    // Hash the password before saving
    const hashedPassword = await User.hashPassword(password, 10);

    // Create a new user
    console.log("req.user.organization_id", req.user.organization_id);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role,
      organization_id: req.user.organization_id,
    });

    // Respond with success
    return res.status(STATUS_CODES.CREATED).json({
      status: STATUS_CODES.CREATED,
      data: null,
      message: "User created successfully.",
      error: null,
    });
  } catch (err) {
    console.error(err);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      data: null,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id; // Extract the user ID from the URL parameters

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        status: STATUS_CODES.NOT_FOUND,
        data: null,
        message: "User not found.",
        error: null,
      });
    }

    // Proceed to delete the user
    await User.destroy({ where: { id: userId } });

    return res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      data: null,
      message: "User deleted successfully.",
      error: null,
    });
  } catch (err) {
    console.error(err);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      data: null,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};


const updatePassword = async (req, res) => {
  try {
    const { old_password, new_password } = req.body;
    const user = req.user; // Assuming user info is attached to the request after JWT authentication
    console.log('user', user.password);
    if (!old_password || !new_password) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        status: STATUS_CODES.BAD_REQUEST,
        data: null,
        message: "Old password and new password are required.",
        error: null,
      });
    }

    // Find user in the database
    // const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        status: STATUS_CODES.NOT_FOUND,
        data: null,
        message: "User not found.",
        error: null,
      });
    }

    // Check if the old password matches the current password
    const isPasswordValid = await User.comparePassword(old_password, user.password);

    if (!isPasswordValid) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        status: STATUS_CODES.FORBIDDEN,
        data: null,
        message: "Old password is incorrect.",
        error: null,
      });
    }

    // Hash the new password and update it
    const hashedNewPassword = await User.hashPassword(new_password);

    // Update the password in the database
    await User.update({ password: hashedNewPassword }, { where: { id: user.id } });

    return res.status(STATUS_CODES.NO_CONTENT).json({
      status: STATUS_CODES.NO_CONTENT,
      data: null,
      message: "Password updated successfully.",
      error: null,
    });
  } catch (err) {
    console.error(err);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      data: null,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

module.exports = {
  getUsers,
  addUser,
  deleteUser,
  updatePassword
};
