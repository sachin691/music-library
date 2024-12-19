// src/models/Playlist.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const User = require("./User");
const Track = require("./Track");
const PlaylistTrack = require("./PlaylistTrack");

class Playlist extends Model {
  static async addTrackToPlaylist(playlist_id, track_id, user_id) {
    try {
      // Validate if the playlist exists and belongs to the user
      console.log("1.....");
      const playlist = await Playlist.findOne({
        where: { id: playlist_id, user_id: user_id },
      });

      console.log("user id ==> ", user_id);

      if (!playlist) {
        throw new Error("Playlist not found or you do not have access.");
      }
      console.log("1st pass....");

      // Check if the track exists
      const track = await Track.findByPk(track_id);
      if (!track) {
        throw new Error("Track not found.");
      }

      console.log("2nd pass...");

      // Check if the track is already added to the playlist
      const existingTrack = await PlaylistTrack.findOne({
        where: { playlist_id, track_id },
      });
      if (existingTrack) {
        throw new Error("Track is already added to the playlist.");
      }

      console.log("3rd pass...");

      // Assign an order value to the track (could be the next available position)
      const maxOrder = await PlaylistTrack.max("order", {
        where: { playlist_id },
      });
      const order = maxOrder ? maxOrder + 1 : 1; // Set order to the next available number, or 1 if no tracks exist

      // Log the order value to ensure it's an integer
      console.log("Order Value:", order);

      // Add the track to the playlist with the assigned order
      console.log(playlist_id, track_id, order);
      await PlaylistTrack.create({
        playlist_id: playlist_id,
        track_id: track_id,
        order: order, // Add the order field
      });

      return { success: true, message: "Track added to playlist successfully." };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  static async removeTrackFromPlaylist(playlist_id, track_id) {
    try {
      // Check if the playlist exists
      const playlist = await Playlist.findByPk(playlist_id);
      if (!playlist) {
        throw new Error("Playlist not found.");
      }

      // Check if the track exists in the playlist
      const playlistTrack = await PlaylistTrack.findOne({
        where: { playlist_id, track_id },
      });
      if (!playlistTrack) {
        throw new Error("Track not found in the playlist.");
      }

      // Remove the track from the playlist
      await playlistTrack.destroy();

      return { success: true, message: "Track removed from playlist successfully." };
    } catch (error) {
      throw error;
    }
  }

  static async getTracksInPlaylist(playlist_id) {
    // Assuming PlaylistTrack is a join table between Playlists and Tracks
    return await PlaylistTrack.findAll({
      where: { playlist_id },
      include: [
        {
          model: Track, // Assuming Track is another model in your database
          as: "tracks", // Make sure to define associations between Playlist and Track
          attributes: ["id", "name", "artist_id", "duration"], // Select track details
        },
      ],
      order: [["order", "ASC"]], // Optionally order tracks based on the 'order' field
    });
  }

  // Static method to define associations
  static associate(models) {
    // Playlist belongs to User (one-to-many)
    Playlist.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });

    // Playlist belongs to many Tracks (many-to-many via PlaylistTrack)
    Playlist.belongsToMany(models.Track, {
      through: "playlist_tracks",
      foreignKey: "playlist_id",
      as: "tracks",
    });
  }
}

Playlist.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    tags: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Playlist",
    tableName: "playlists",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Playlist;
