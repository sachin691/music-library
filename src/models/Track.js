// src/models/Track.js

const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const Artist = require("./Artist");
const Album = require("./Album");
const Organization = require("./Organization");

class Track extends Model {}

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
    organization_id: {
      type: DataTypes.UUID,
      references: {
        model: "organizations",
        key: "id",
      },
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

// Define associations
Track.belongsTo(Artist, {
  foreignKey: "artist_id",
  as: "artist",
});

Track.belongsTo(Album, {
  foreignKey: "album_id",
  as: "album",
});

Track.belongsTo(Organization, {
  foreignKey: "organization_id",
  as: "organization",
});

module.exports = Track;
