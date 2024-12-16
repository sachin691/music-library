// src/models/Playlist.js

const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const User = require("./User");

class Playlist extends Model {}

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
        model: "users", // Ensure this references the `users` table
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
      defaultValue: false, // Default to private playlist
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

// Define the association from Playlist to User
Playlist.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

module.exports = Playlist;
