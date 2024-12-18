// src/models/Album.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const Artist = require("./Artist");
const Organization = require("./Organization");

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
        model: "artists",
        key: "id",
      },
      allowNull: false, // An album must have an associated artist
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cover_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    organization_id: {
      type: DataTypes.UUID,
      references: {
        model: "organizations",
        key: "id",
      },
      allowNull: true,
    },
    tags: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true, // Optional
    },
    hidden: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Default to not hidden
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
    modelName: "Album",
    tableName: "albums",
    timestamps: true,
    underscored: true,
  }
);

// Define associations with onDelete: 'CASCADE'
Album.belongsTo(Artist, {
  foreignKey: "artist_id",
  as: "artist",
  onDelete: "CASCADE", // Ensuring the album is deleted when artist is deleted
});

Album.belongsTo(Organization, {
  foreignKey: "organization_id",
  as: "organization",
  onDelete: "CASCADE", // Ensuring the album is deleted when organization is deleted
});

module.exports = Album;
