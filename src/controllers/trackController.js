const { Track, Artist, Album } = require("../models"); // Import models
const { ROLES, STATUS_CODES } = require("../utils/constants");

const getAllTracks = async (req, res) => {
  try {
    const { limit = 5, offset = 0, artist_id, album_id, hidden } = req.query; // Extract query params

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
    const { track_id } = req.params; // Extract track ID from the route parameter

    // Fetch the track by its ID
    const track = await Track.findOne({
      where: { id: track_id },
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
    });

    // If the track is not found, return 404
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
    console.error(error);
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
    const { artist_id, album_id, name, duration, hidden, audio_url } = req.body; // Extract fields from request body
    const { user } = req; // Get logged-in user from the middleware (authenticate)

    if (!artist_id || !album_id || !name || !duration || !audio_url) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        status: STATUS_CODES.NOT_FOUND,
        data: null,
        message: "Resource Doesn't Exist",
        error: null,
      });
    }

    // Check if the logged-in user is admin or editor
    // if (![ROLES.ADMIN, ROLES.EDITOR].includes(user.role)) {
    //   return res.status(STATUS_CODES.FORBIDDEN).json({
    //     status: STATUS_CODES.FORBIDDEN,
    //     data: null,
    //     message: "Forbidden: You do not have permission to add a new track.",
    //     error: null,
    //   });
    // }

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

    // Create the new track
    console.log("user.organization_id ==> ", user.organization_id);
    const newTrack = await Track.create({
      artist_id,
      album_id,
      title: name,
      duration,
      hidden: hidden || false, // Default to false if not provided
      audio_url,
      organization_id: user.organization_id
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
    const { id } = req.params; // Extract track ID from the route parameter
    const { user } = req; // Get logged-in user from the middleware (authenticate)

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
    console.error(error);
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
