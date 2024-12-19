const { up } = require("../migrations/20241218150906-add-on-delete-cascade-to-organization-artist");
const Album = require("../models/Album");
const Artist = require("../models/Artist");
const { STATUS_CODES } = require("../utils/constants"); 
const { ROLES } = require("../utils/constants");


const getAllAlbums = async (req, res) => {
  try {
    const { limit = 20, offset = 0, artist_id, hidden } = req.query;
    const organizationId = req.user.organization_id;

    const whereClause = { organization_id: organizationId };

    // Add filters based on query parameters
    if (artist_id) whereClause.artist_id = artist_id; 
    if (hidden !== undefined) whereClause.hidden = hidden; 

    // Fetch albums with Sequelize, including the associated artist information
    const albums = await Album.findAll({
      where: whereClause,
      limit: parseInt(limit, 10), 
      offset: parseInt(offset, 10), 
      include: [
        {
          model: Artist, 
          as: "artist", 
          attributes: ["name", "id" ], 
        },
      ],
      attributes: ["id", "title", "year", "hidden", "genre", "cover_image", "tags", "created_at", "updated_at"], 
      order: [["created_at", "DESC"]],
    });

    return res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      data: albums.map((album) => ({
        album_id: album.id,
        artist_name: album.artist.name, 
        artist_id: album.artist.id,
        name: album.title,
        year: album.year,
        hidden: album.hidden,
      })),
      message: "Albums retrieved successfully.",
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

const getAlbumById = async (req, res) => {
  try {
    const { id } = req.params; 

    // Fetch the album by ID
    const album = await Album.findOne({
      where: { id },
      include: [
        {
          model: Artist, 
          as: "artist", 
          attributes: ["name"], 
        },
      ],
      attributes: [
        "id",
        "title",
        "year",
        "hidden",
        "genre",
        "cover_image",
        "tags",
        "created_at",
        "updated_at",
      ],
    });

    if (!album) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        status: STATUS_CODES.NOT_FOUND,
        data: null,
        message: "Album not found.",
        error: null,
      });
    }

    return res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      data: {
        album_id: album.id,
        artist_name: album.artist.name, 
        artist_id: album.artist_id,
        name: album.title,
        year: album.year,
        hidden: album.hidden,
      },
      message: "Album retrieved successfully.",
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

const addAlbum = async (req, res) => {
  try {
    const { artist_id, name, year, hidden } = req.body;
    const { user } = req; 

    if (!artist_id) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        status: STATUS_CODES.NOT_FOUND,
        data: null,
        message: "Resource Doesn't Exist",
        error: null,
      });
    }


    const artist = await Artist.findOne({ where: { id: artist_id } });
    if (!artist) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        status: STATUS_CODES.NOT_FOUND,
        data: null,
        message: "Artist not found.",
        error: null,
      });
    }

    const newAlbum = await Album.create({
      artist_id,
      title: name, // Mapping the `name` field to `title` in the Album model
      year,
      hidden,
      organization_id: user.organization_id, 
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
    const { id } = req.params; 
    const { title, artist_id, genre, cover_image, tags, year, hidden } = req.body; 
    const { user } = req; 

    
    // Check if the logged-in user is admin or editor
    if (![ROLES.ADMIN, ROLES.EDITOR].includes(user.role)) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        status: STATUS_CODES.FORBIDDEN,
        data: null,
        message: "Forbidden: You do not have permission to update this album.",
        error: null,
      });
    }

    const album = await Album.findOne({
      where: { id },
    });

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

    const updatedAlbum = await album.update({
      title: title || album.title,
      artist_id: artist_id || album.artist_id,
      genre: genre || album.genre,
      cover_image: cover_image || album.cover_image,
      tags: tags || album.tags,
      year: year || album.year,
      hidden: hidden !== undefined ? hidden : album.hidden, 
    });

    return res.status(STATUS_CODES.NO_CONTENT).json({
      status: STATUS_CODES.NO_CONTENT,
      data: null,
      message: "Album updated successfully.",
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


const deleteAlbum = async (req, res) => {
  try {
    const { id } = req.params; 
    const { user } = req; 

    if (![ROLES.ADMIN, ROLES.EDITOR].includes(user.role)) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        status: STATUS_CODES.FORBIDDEN,
        data: null,
        message: "Forbidden: You do not have permission to delete this album.",
        error: null,
      });
    }

    const album = await Album.findOne({
      where: { id },
    });

    if (!album) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        status: STATUS_CODES.NOT_FOUND,
        data: null,
        message: "Album not found.",
        error: null,
      });
    }

    await album.destroy();

    return res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      data: null,
      message: `Album: ${album.title} deleted successfully.`,
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


module.exports = { getAllAlbums, getAlbumById, addAlbum, updateAlbum, deleteAlbum };
