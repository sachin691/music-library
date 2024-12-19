// src/models/Track.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/index");

class Track extends Model {
  static associate(models) {
    // Track belongs to Artist (one-to-many)
    console.log("Associating Track with PlaylistTrack and others...");

    Track.belongsTo(models.Artist, {
      foreignKey: "artist_id",
      as: "artist",
    });

    // Track belongs to Album (many-to-one)
    Track.belongsTo(models.Album, {
      foreignKey: "album_id",
      as: "album",
    });

    // Track belongs to Organization (many-to-one)
    Track.belongsTo(models.Organization, {
      foreignKey: "organization_id",
      as: "organization",
    });

    // Track belongs to many Playlists (many-to-many via playlist_tracks)
    Track.belongsToMany(models.Playlist, {
      through: "playlist_tracks",
      foreignKey: "track_id",
      as: "playlists",
    });
  }
}

Track.init(
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
    duration: {
      type: DataTypes.INTEGER, // Duration in seconds
      allowNull: false,
    },
    artist_id: {
      type: DataTypes.UUID,
      references: {
        model: "artists",
        key: "id",
      },
      allowNull: false,
    },
    album_id: {
      type: DataTypes.UUID,
      references: {
        model: "albums",
        key: "id",
      },
      allowNull: false,
    },
    organization_id: {
      type: DataTypes.UUID,
      references: {
        model: "organizations", // Assuming you have an 'organizations' table
        key: "id",
      },
      allowNull: false,
    },
    play_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    audio_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lyrics: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tags: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    hidden: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
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
    modelName: "Track",
    tableName: "tracks",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Track;
