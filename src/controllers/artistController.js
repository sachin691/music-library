// src/controllers/artistController.js
const  Artist  = require("../models/Artist");
const { STATUS_CODES, ROLES } = require("../utils/constants");

const getAllArtists = async (req, res) => {
  try {
    const { limit = 20, offset = 0, grammy, hidden } = req.query;
    const organizationId = req.user.organization_id;

    const whereClause = { organization_id: organizationId };
    if (grammy !== undefined) whereClause.grammy = grammy; // Filter by Grammy awards
    if (hidden !== undefined) whereClause.hidden = hidden; // Filter by visibility

    const artists = await Artist.findAll({
      where: whereClause,
      limit: parseInt(limit, 10), // Convert to integer
      offset: parseInt(offset, 10), // Convert to integer
      attributes: ["id", "name", "grammy", "hidden"], 
      order: [["created_at", "DESC"]],
    });

    return res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      data: artists,
      message: "Artists retrieved successfully.",
      error: null,
    });
  } catch (error) {
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
    const { id } = req.params; 

    const artist = await Artist.findOne({
      where: { id },
      attributes: ["id", "name", "grammy", "hidden"], 
    });

    if (!artist) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        status: STATUS_CODES.NOT_FOUND,
        data: null,
        message: "Artist not found.",
        error: null,
      });
    }

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
    const { name, grammy, hidden, bio } = req.body; 
    const { user } = req; 

    if (!user.organization_id) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        status: STATUS_CODES.BAD_REQUEST,
        data: null,
        message: "Bad Request: Organization ID is missing for the logged-in user.",
        error: null,
      });
    }

    const newArtist = await Artist.create({
      name,
      grammy,
      hidden,
      bio,
      organization_id: user.organization_id, // Assign the user's organization ID
    });

    return res.status(STATUS_CODES.CREATED).json({
      status: STATUS_CODES.CREATED,
      data: null,
      message: "Artist created successfully.",
      error: null,
    });
  } catch (error) {
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
    const { id } = req.params; 
    const { name, grammy, hidden, bio, tags, profile_picture } = req.body; 
    const { user } = req;

    // Check if user has admin or viewer role
    if (![ROLES.ADMIN, ROLES.EDITOR].includes(user.role)) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        status: STATUS_CODES.FORBIDDEN,
        data: null,
        message: "Forbidden: You do not have permission to update this artist.",
        error: null,
      });
    }

    const artist = await Artist.findByPk(id);

    if (!artist) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        status: STATUS_CODES.NOT_FOUND,
        data: null,
        message: "Artist not found.",
        error: null,
      });
    }

    const updatedData = {};
    if (name !== undefined) updatedData.name = name;
    if (grammy !== undefined) updatedData.grammy = grammy;
    if (hidden !== undefined) updatedData.hidden = hidden;
    if (bio !== undefined) updatedData.bio = bio;
    if (tags !== undefined) updatedData.tags = tags;
    if (profile_picture !== undefined) updatedData.profile_picture = profile_picture;

    await artist.update(updatedData);

    return res.status(STATUS_CODES.NO_CONTENT).json({
      status: STATUS_CODES.NO_CONTENT,
      data: null,
      message: "Artist updated successfully.",
      error: null,
    });
  } catch (error) {
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
    const { id } = req.params; 
    const { user } = req; 

    if (![ROLES.ADMIN, ROLES.EDITOR].includes(user.role)) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        status: STATUS_CODES.FORBIDDEN,
        data: null,
        message: "Forbidden: You do not have permission to delete this artist.",
        error: null,
      });
    }

    const artist = await Artist.findByPk(id);

    if (!artist) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        status: STATUS_CODES.NOT_FOUND,
        data: null,
        message: "Artist not found.",
        error: null,
      });
    }

    const artistName = artist.name;

    await artist.destroy();

    return res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      data: { artist_id: id },
      message: `Artist: ${artistName} deleted successfully.`,
      error: null,
    });
  } catch (error) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      status: STATUS_CODES.BAD_REQUEST,
      data: null,
      message: "Bad Request: Unable to delete artist.",
      error: error.message,
    });
  }
};

module.exports = { getAllArtists, getArtistById, addArtist, updateArtist, deleteArtist };
