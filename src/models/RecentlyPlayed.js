// src/models/RecentlyPlayed.js

const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const User = require("./User");
const Track = require("./Track");

class RecentlyPlayed extends Model {}

RecentlyPlayed.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: "users", // Make sure this references the `users` table
        key: "id",
      },
      allowNull: false,
    },
    track_id: {
      type: DataTypes.UUID,
      references: {
        model: "tracks", // Make sure this references the `tracks` table
        key: "id",
      },
      allowNull: false,
    },
    played_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, // Automatically set to current time
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
    modelName: "RecentlyPlayed",
    tableName: "recently_played",
    timestamps: true,
    underscored: true,
  }
);

// Define associations
RecentlyPlayed.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

RecentlyPlayed.belongsTo(Track, {
  foreignKey: "track_id",
  as: "track",
});

module.exports = RecentlyPlayed;
