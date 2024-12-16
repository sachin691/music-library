// src/models/Album.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const Artist = require("./Artist"); // Import Artist model
const Organization = require("./Organization"); // Import Organization model (if required)

class Album extends Model {}

Album.init(
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
    artist_id: {
      type: DataTypes.UUID,
      references: {
        model: "artists", // The `artists` table reference
        key: "id",
      },
      allowNull: false, // An album must have an associated artist
    },
    release_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    genre: {
      type: DataTypes.STRING, // Genre as a string, can be an enum if needed
      allowNull: true,
    },
    cover_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    organization_id: {
      type: DataTypes.UUID,
      references: {
        model: "organizations", // The `organizations` table reference
        key: "id",
      },
      allowNull: true,
    },
    tags: {
      type: DataTypes.JSONB, // JSONB for storing tags like "Greatest Hits", "Live"
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
    modelName: "Album",
    tableName: "albums",
    timestamps: true,
    underscored: true,
  }
);

// Define associations
Album.belongsTo(Artist, {
  foreignKey: "artist_id", // The artist reference in the album model
  as: "artist", // Alias for the relationship
});

Album.belongsTo(Organization, {
  foreignKey: "organization_id", // The organization reference in the album model
  as: "organization", // Alias for the relationship
});

module.exports = Album;
