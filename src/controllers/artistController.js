// src/controllers/artistController.js
const { Artist } = require("../models");
const { STATUS_CODES, ROLES } = require("../utils/constants");

const getAllArtists = async (req, res) => {
  try {
    // Extract query parameters with default values
    const { limit = 5, offset = 0, grammy, hidden } = req.query;
    const organizationId = req.user.organization_id;
    // Build the filter options
    const whereClause = { organization_id: organizationId };
    if (grammy !== undefined) whereClause.grammy = grammy; // Filter by Grammy awards
    if (hidden !== undefined) whereClause.hidden = hidden; // Filter by visibility

    // Fetch artists with Sequelize
    const artists = await Artist.findAll({
      where: whereClause,
      limit: parseInt(limit, 10), // Convert to integer
      offset: parseInt(offset, 10), // Convert to integer
      attributes: ["id", "name", "grammy", "hidden"], // Fetch only necessary fields
    });

    // Respond with the list of artists
    return res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      data: artists,
      message: "Artists retrieved successfully.",
      error: null,
    });
  } catch (error) {
    // Handle errors
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      status: STATUS_CODES.BAD_REQUEST,
      data: null,
      message: "Bad Request",
      error: error.message,
    });
  }
};


const getArtistById = async (req, res) => {
  try {
    const { id } = req.params; // Extract artist ID from the route parameter

    // Fetch the artist by ID
    const artist = await Artist.findOne({
      where: { id },
      attributes: ["id", "name", "grammy", "hidden"], // Select specific fields
    });

    // Handle case when artist is not found
    if (!artist) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        status: STATUS_CODES.NOT_FOUND,
        data: null,
        message: "Artist not found.",
        error: null,
      });
    }

    // Respond with the artist data
    return res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      data: artist,
      message: "Artist retrieved successfully.",
      error: null,
    });
  } catch (error) {
    console.error(error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      data: null,
      message: "Internal server error.",
      error: error.message,
    });
  }
};


const addArtist = async (req, res) => {
  try {
    const { name, grammy, hidden } = req.body; // Extract artist details from the request body
    const { user } = req; // Get the logged-in user from the middleware (authenticate)

    // // Check if the logged-in user is admin or viewer
    // if (!["admin", "viewer"].includes(user.role)) {
    //   return res.status(STATUS_CODES.FORBIDDEN).json({
    //     status: STATUS_CODES.FORBIDDEN,
    //     data: null,
    //     message: "Forbidden: You do not have permission to create an artist.",
    //     error: null,
    //   });
    // }

    // Check if the organization_id exists in the logged-in user's profile
    if (!user.organization_id) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        status: STATUS_CODES.BAD_REQUEST,
        data: null,
        message: "Bad Request: Organization ID is missing for the logged-in user.",
        error: null,
      });
    }

    // Create the new artist
    const newArtist = await Artist.create({
      name,
      grammy,
      hidden,
      organization_id: user.organization_id, // Assign the user's organization ID
    });

    return res.status(STATUS_CODES.CREATED).json({
      status: STATUS_CODES.CREATED,
      data: null,
      message: "Artist created successfully.",
      error: null,
    });
  } catch (error) {
    console.error(error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      data: null,
      message: "Internal server error.",
      error: error.message,
    });
  }
};


const updateArtist = async (req, res) => {
  try {
    const { id } = req.params; // Get artist ID from URL params
    const { name, grammy, hidden, bio, tags, profile_picture } = req.body; // Get updatable fields from request body
    const { user } = req; // Logged-in user from middleware

    // Check if user has admin or viewer role
    if (![ROLES.ADMIN, ROLES.EDITOR].includes(user.role)) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        status: STATUS_CODES.FORBIDDEN,
        data: null,
        message: "Forbidden: You do not have permission to update this artist.",
        error: null,
      });
    }

    // Find the artist by ID
    const artist = await Artist.findByPk(id);

    // If artist not found, return 404
    if (!artist) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        status: STATUS_CODES.NOT_FOUND,
        data: null,
        message: "Artist not found.",
        error: null,
      });
    }

    // Update only the fields provided in the request body
    const updatedData = {};
    if (name !== undefined) updatedData.name = name;
    if (grammy !== undefined) updatedData.grammy = grammy;
    if (hidden !== undefined) updatedData.hidden = hidden;
    if (bio !== undefined) updatedData.bio = bio;
    if (tags !== undefined) updatedData.tags = tags;
    if (profile_picture !== undefined) updatedData.profile_picture = profile_picture;

    // Update the artist record
    await artist.update(updatedData);

    // Return 204 No Content
    return res.status(STATUS_CODES.NO_CONTENT).json({
      status: STATUS_CODES.NO_CONTENT,
      data: null,
      message: "Artist updated successfully.",
      error: null,
    });
  } catch (error) {
    console.error("Error updating artist:", error);
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      status: STATUS_CODES.BAD_REQUEST,
      data: null,
      message: "Bad Request: Unable to update artist.",
      error: error.message,
    });
  }
};



const deleteArtist = async (req, res) => {
  try {
    const { id } = req.params; // Get artist ID from URL params
    const { user } = req; // Logged-in user from middleware

    // Check if user has admin or editor role
    if (![ROLES.ADMIN, ROLES.EDITOR].includes(user.role)) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        status: STATUS_CODES.FORBIDDEN,
        data: null,
        message: "Forbidden: You do not have permission to delete this artist.",
        error: null,
      });
    }

    // Find the artist by ID
    const artist = await Artist.findByPk(id);

    // If artist not found, return 404
    if (!artist) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        status: STATUS_CODES.NOT_FOUND,
        data: null,
        message: "Artist not found.",
        error: null,
      });
    }

    // Store artist name before deleting for a more descriptive response
    const artistName = artist.name;

    // Delete the artist
    await artist.destroy();

    // Return success response
    return res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      data: { artist_id: id },
      message: `Artist: ${artistName} deleted successfully.`,
      error: null,
    });
  } catch (error) {
    console.error("Error deleting artist:", error);
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      status: STATUS_CODES.BAD_REQUEST,
      data: null,
      message: "Bad Request: Unable to delete artist.",
      error: error.message,
    });
  }
};

module.exports = { getAllArtists, getArtistById, addArtist, updateArtist, deleteArtist };
