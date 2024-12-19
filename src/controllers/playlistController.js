// src/controllers/playlistController.js

const Playlist = require("../models/Playlist");
const Track = require("../models/Track");
const { STATUS_CODES } = require("../utils/constants"); // Assuming you have this for status codes

// Create a new playlist
const createPlaylist = async (req, res) => {
  try {
    const { title, description, is_public, tags } = req.body;
    const user_id = req.user.id; // Assuming user_id is coming from the authentication middleware

    if (!title || is_public === undefined) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        status: STATUS_CODES.NOT_FOUND,
        data: null,
        message: "Resource Doesn't Exist: Title is required",
        error: null,
      });
    }

    // Create a new playlist
    const playlist = await Playlist.create({
      title,
      user_id,
      description,
      is_public,
      tags,
    });

    return res.status(STATUS_CODES.CREATED).json({
      status: STATUS_CODES.CREATED,
      data: playlist,
      message: "Playlist created successfully.",
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

// Add a track to a playlist
const addTrackToPlaylist = async (req, res) => {
  try {
    const { playlist_id, track_id } = req.body;
    const user_id = req.user.id; // Assuming user_id is coming from the authentication middleware

    if (!playlist_id || !track_id) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        status: STATUS_CODES.BAD_REQUEST,
        data: null,
        message: "Both playlist_id and track_id are required.",
        error: null,
      });
    }

    console.log("going....");

    // Use the static method from the Playlist model to add track to the playlist
    const response = await Playlist.addTrackToPlaylist(playlist_id, track_id, user_id);

    if (!response.success) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        status: STATUS_CODES.BAD_REQUEST,
        data: null,
        message: response.message,
        error: null,
      });
    }

    return res.status(STATUS_CODES.CREATED).json({
      status: STATUS_CODES.CREATED,
      data: null,
      message: response.message,
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

// Remove a track from a playlist
const removeTrackFromPlaylist = async (req, res) => {
  try {
    const { playlist_id, track_id } = req.params;

    // Use static method to remove track from playlist
    const response = await Playlist.removeTrackFromPlaylist(playlist_id, track_id);

    return res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      data: null,
      message: response.message,
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

// Get all tracks in a playlist
const getTracksInPlaylist = async (req, res) => {
  try {
    const { playlist_id } = req.params;
    const user_id = req.user.id; // Assuming `user.id` comes from the authenticate middleware

    // Get the playlist details (to check its visibility and ownership)
    const playlist = await Playlist.findOne({
      where: { id: playlist_id },
    });

    if (!playlist) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        status: STATUS_CODES.NOT_FOUND,
        data: null,
        message: "Playlist not found.",
        error: null,
      });
    }

    // If the playlist is private, check if the user is the owner
    if (!playlist.is_public && playlist.user_id !== user_id) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        status: STATUS_CODES.FORBIDDEN,
        data: null,
        message: "You do not have permission to view this playlist.",
        error: null,
      });
    }

    // Use the static method to retrieve tracks from the playlist
    const tracks = await Playlist.getTracksInPlaylist(playlist_id);

    return res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      data: { tracks },
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

module.exports = {
  createPlaylist,
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  getTracksInPlaylist,
};
