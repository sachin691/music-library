const Track = require("../models/Track");
const Artist = require("../models/Artist");
const Album = require("../models/Album");

const { ROLES, STATUS_CODES } = require("../utils/constants");

const getAllTracks = async (req, res) => {
  try {
    const { limit = 20, offset = 0, artist_id, album_id, hidden } = req.query; // Extract query params

    // Convert limit and offset to integers
    const limitValue = parseInt(limit, 10);
    const offsetValue = parseInt(offset, 10);

    // Build filter conditions
    const filterConditions = {};

    if (artist_id) {
      filterConditions.artist_id = artist_id;
    }

    if (album_id) {
      filterConditions.album_id = album_id;
    }

    if (hidden !== undefined) {
      filterConditions.hidden = hidden === "true"; // Convert string 'true' to boolean true
    }

    // Fetch tracks with optional filtering, pagination, and sorting
    const tracks = await Track.findAll({
      where: filterConditions,
      limit: limitValue,
      offset: offsetValue,
      include: [
        {
          model: Artist,
          as: "artist",
          attributes: ["name"], // Only include the artist name
        },
        {
          model: Album,
          as: "album",
          attributes: ["title"], // Only include the album title
        },
      ],
      order: [["created_at", "DESC"]], // Optional: Order by most recent tracks
    });

    // If no tracks found, return 404
    if (!tracks.length) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        status: STATUS_CODES.NOT_FOUND,
        data: null,
        message: "No tracks found matching the given criteria.",
        error: null,
      });
    }

    // Format tracks data
    const formattedTracks = tracks.map((track) => ({
      track_id: track.id,
      artist_name: track.artist.name,
      album_name: track.album.title,
      name: track.title,
      duration: track.duration,
      hidden: track.hidden,
    }));

    return res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      data: formattedTracks,
      message: "Tracks retrieved successfully.",
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


const getTrackById = async (req, res) => {
  try {
    const { track_id } = req.params; 

    // Fetch the track by its ID
    const track = await Track.findOne({
      where: { id: track_id },
      include: [
        {
          model: Artist,
          as: "artist",
          attributes: ["name"], 
        },
        {
          model: Album,
          as: "album",
          attributes: ["title"], 
        },
      ],
    });

    if (!track) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        status: STATUS_CODES.NOT_FOUND,
        data: null,
        message: "Track not found.",
        error: null,
      });
    }

    // Format the track data
    const formattedTrack = {
      track_id: track.id,
      artist_name: track.artist.name,
      album_name: track.album.title,
      name: track.title,
      duration: track.duration,
      hidden: track.hidden,
    };

    return res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      data: formattedTrack,
      message: "Track retrieved successfully.",
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

const addTrack = async (req, res) => {
  try {
    const { artist_id, album_id, name, duration, hidden, audio_url } = req.body; 
    const { user } = req; 

    if (!artist_id || !album_id || !name || !duration || !audio_url) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        status: STATUS_CODES.NOT_FOUND,
        data: null,
        message: "Resource Doesn't Exist",
        error: null,
      });
    }

    // Ensure the artist exists
    const artist = await Artist.findOne({ where: { id: artist_id } });
    if (!artist) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        status: STATUS_CODES.NOT_FOUND,
        data: null,
        message: "Artist not found.",
        error: null,
      });
    }

    // Ensure the album exists
    const album = await Album.findOne({ where: { id: album_id } });
    if (!album) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        status: STATUS_CODES.NOT_FOUND,
        data: null,
        message: "Album not found.",
        error: null,
      });
    }

    // Check if a track with the same name already exists for the same artist and album
    const existingTrack = await Track.findOne({
      where: {
        artist_id,
        album_id,
        title: name, 
      },
    });

    if (existingTrack) {
      return res.status(STATUS_CODES.CONFLICT).json({
        status: STATUS_CODES.CONFLICT,
        data: null,
        message: "Track with the same name already exists in this album for the artist.",
        error: null,
      });
    }

    // Create the new track
    const newTrack = await Track.create({
      artist_id,
      album_id,
      title: name,
      duration,
      hidden: hidden || false, // Default to false if not provided
      audio_url,
      organization_id: user.organization_id,
    });

    return res.status(STATUS_CODES.CREATED).json({
      status: STATUS_CODES.CREATED,
      data: null,
      message: "Track created successfully.",
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



const deleteTrack = async (req, res) => {
  try {
    const { id } = req.params; 
    const { user } = req; 

    // Check if the logged-in user is admin or editor
    if (![ROLES.ADMIN, ROLES.EDITOR].includes(user.role)) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        status: STATUS_CODES.FORBIDDEN,
        data: null,
        message: "Forbidden: You do not have permission to delete this track.",
        error: null,
      });
    }

    // Fetch the track by ID
    const track = await Track.findOne({
      where: { id },
    });

    // If track not found, return 404
    if (!track) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        status: STATUS_CODES.NOT_FOUND,
        data: null,
        message: "Track not found.",
        error: null,
      });
    }

    // Delete the track
    await track.destroy();

    return res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      data: null,
      message: `Track: ${track.title} deleted successfully.`,
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


module.exports = {
  getAllTracks,
  getTrackById,
  addTrack,
  deleteTrack
};
