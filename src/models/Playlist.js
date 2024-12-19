const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const User = require("./User");
const Track = require("./Track");
const PlaylistTrack = require("./PlaylistTrack");


class Playlist extends Model {
  static async addTrackToPlaylist(playlist_id, track_id, user_id) {
    try {
      // Validate if the playlist exists and belongs to the user
      const playlist = await Playlist.findOne({
        where: { id: playlist_id, user_id },
      });
      if (!playlist) {
        throw new Error("Playlist not found or you do not have access.");
      }

      // Check if the track exists
      const track = await Track.findByPk(track_id);
      if (!track) {
        throw new Error("Track not found.");
      }

      // Check if the track is already added to the playlist
      const existingTrack = await PlaylistTrack.findOne({
        where: { playlist_id, track_id },
      });
      if (existingTrack) {
        throw new Error("Track is already added to the playlist.");
      }

      // Add the track to the playlist
      await PlaylistTrack.create({ playlist_id, track_id });

      return { success: true, message: "Track added to playlist successfully." };
    } catch (error) {
      return { success: false, message: error.message };
    }
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

// Define relationships

Playlist.associate = (models) => {
  Playlist.belongsTo(User, { foreignKey: "user_id", as: "user" });
  Playlist.belongsToMany(Track, { through: "playlist_tracks", foreignKey: "playlist_id", as: "tracks" });
};



module.exports = Playlist;
