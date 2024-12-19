const { up } = require("../migrations/20241218150906-add-on-delete-cascade-to-organization-artist");
const { Album, Artist } = require("../models"); // Import the models
const { STATUS_CODES } = require("../utils/constants"); // Import the status codes
const { ROLES } = require("../utils/constants");


const getAllAlbums = async (req, res) => {
  try {
    // Extract query parameters with default values
    const { limit = 5, offset = 0, artist_id, hidden } = req.query;
    const organizationId = req.user.organization_id;

    // Initialize the 'where' clause with the organization ID
    const whereClause = { organization_id: organizationId };

    // Add filters based on query parameters
    if (artist_id) whereClause.artist_id = artist_id; // Filter by artist ID
    if (hidden !== undefined) whereClause.hidden = hidden; // Filter by visibility status

    // Fetch albums with Sequelize, including the associated artist information
    const albums = await Album.findAll({
      where: whereClause,
      limit: parseInt(limit, 10), // Limit the number of results
      offset: parseInt(offset, 10), // Skip a number of results based on offset
      include: [
        {
          model: Artist, // Include the Artist model
          as: "artist", // Alias for the relationship
          attributes: ["name"], // Fetch only the artist name
        },
      ],
      attributes: ["id", "title", "year", "hidden", "genre", "cover_image", "tags", "created_at", "updated_at"], // Fetch only necessary fields for albums
      order: [["created_at", "DESC"]],
    });

    // Return the albums in the response
    return res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      data: albums.map((album) => ({
        album_id: album.id,
        artist_name: album.artist.name, // Include the artist name in the response
        name: album.title,
        year: album.year,
        hidden: album.hidden,
      })),
      message: "Albums retrieved successfully.",
      error: null,
    });
  } catch (error) {
    // Handle errors and send the error response
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      status: STATUS_CODES.BAD_REQUEST,
      data: null,
      message: "Bad Request",
      error: error.message,
    });
  }
};

const getAlbumById = async (req, res) => {
  try {
    const { id } = req.params; // Extract album ID from the route parameter

    // Fetch the album by ID
    const album = await Album.findOne({
      where: { id },
      include: [
        {
          model: Artist, // Include the associated Artist model
          as: "artist", // Alias for the relationship
          attributes: ["name"], // Fetch only the artist name
        },
      ],
      attributes: [
        "id",
        "title",
        "year",
        "hidden",
        "release_date",
        "genre",
        "cover_image",
        "tags",
        "created_at",
        "updated_at",
      ], // Select specific fields for the album
    });

    // Handle case when album is not found
    if (!album) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        status: STATUS_CODES.NOT_FOUND,
        data: null,
        message: "Album not found.",
        error: null,
      });
    }

    // Respond with the album data
    return res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      data: {
        album_id: album.id,
        artist_name: album.artist.name, // Include artist name in the response
        name: album.title,
        year: album.year,
        hidden: album.hidden,
      },
      message: "Album retrieved successfully.",
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

const addAlbum = async (req, res) => {
  try {
    const { artist_id, name, year, hidden } = req.body; // Extract album details from the request body
    const { user } = req; // Get the logged-in user from the middleware (authenticate)

    if (!artist_id) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        status: STATUS_CODES.NOT_FOUND,
        data: null,
        message: "Resource Doesn't Exist",
        error: null,
      });
    }

    // Check if the logged-in user has the required role (admin or editor)
    // if (![ROLES.ADMIN, ROLES.EDITOR].includes(user.role)) {
    //   return res.status(STATUS_CODES.FORBIDDEN).json({
    //     status: STATUS_CODES.FORBIDDEN,
    //     data: null,
    //     message: "Forbidden: You do not have permission to create an album.",
    //     error: null,
    //   });
    // }

    // Validate that the artist_id exists
    const artist = await Artist.findOne({ where: { id: artist_id } });
    if (!artist) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        status: STATUS_CODES.NOT_FOUND,
        data: null,
        message: "Artist not found.",
        error: null,
      });
    }

    // Create the new album
    const newAlbum = await Album.create({
      artist_id,
      title: name, // Mapping the `name` field to `title` in the Album model
      year,
      hidden,
      organization_id: user.organization_id, // Optional: If you need to assign the album to the user's organization
    });

    return res.status(STATUS_CODES.CREATED).json({
      status: STATUS_CODES.CREATED,
      data: null,
      message: "Album created successfully.",
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


const updateAlbum = async (req, res) => {
  try {
    const { id } = req.params; // Extract album ID from the route parameter
    const { title, artist_id, genre, cover_image, tags, year, hidden } = req.body; // Extract fields from request body
    const { user } = req; // Get logged-in user from the middleware (authenticate)

    
    // Check if the logged-in user is admin or editor
    if (![ROLES.ADMIN, ROLES.EDITOR].includes(user.role)) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        status: STATUS_CODES.FORBIDDEN,
        data: null,
        message: "Forbidden: You do not have permission to update this album.",
        error: null,
      });
    }

    // Fetch the album by ID
    const album = await Album.findOne({
      where: { id },
    });

    // If album not found, return 404
    if (!album) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        status: STATUS_CODES.NOT_FOUND,
        data: null,
        message: "Album not found.",
        error: null,
      });
    }

    if (!title && !artist_id && !genre && !cover_image && !tags && !year && hidden === undefined) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        status: STATUS_CODES.NOT_FOUND,
        data: null,
        message: "Resource doesn't exist",
        error: null,
      });
    }

    // Ensure the artist exists before updating
    if (artist_id) {
      const artist = await Artist.findOne({ where: { id: artist_id } });
      if (!artist) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
          status: STATUS_CODES.NOT_FOUND,
          data: null,
          message: "Artist not found.",
          error: null,
        });
      }
    }

    // Update the album with the provided details
    const updatedAlbum = await album.update({
      title: title || album.title,
      artist_id: artist_id || album.artist_id,
      genre: genre || album.genre,
      cover_image: cover_image || album.cover_image,
      tags: tags || album.tags,
      year: year || album.year,
      hidden: hidden !== undefined ? hidden : album.hidden, // Default to current value if not provided
    });

    // Return the response after successful update
    return res.status(STATUS_CODES.NO_CONTENT).json({
      status: STATUS_CODES.NO_CONTENT,
      data: null,
      message: "Album updated successfully.",
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


const deleteAlbum = async (req, res) => {
  try {
    const { id } = req.params; // Extract album ID from the route parameter
    const { user } = req; // Get logged-in user from the middleware (authenticate)

    // Check if the logged-in user is admin or editor
    if (![ROLES.ADMIN, ROLES.EDITOR].includes(user.role)) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        status: STATUS_CODES.FORBIDDEN,
        data: null,
        message: "Forbidden: You do not have permission to delete this album.",
        error: null,
      });
    }

    // Fetch the album by ID
    console.log('here ==> ', id);
    const album = await Album.findOne({
      where: { id },
    });
    console.log('pass..')

    // If album not found, return 404
    if (!album) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        status: STATUS_CODES.NOT_FOUND,
        data: null,
        message: "Album not found.",
        error: null,
      });
    }

    // Delete the album
    await album.destroy();

    // Return the response after successful deletion
    return res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      data: null,
      message: `Album: ${album.title} deleted successfully.`,
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


module.exports = { getAllAlbums, getAlbumById, addAlbum, updateAlbum, deleteAlbum };
