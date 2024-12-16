// src/models/Favorite.js

const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const User = require("./User");
const Artist = require("./Artist");
const Album = require("./Album");
const Track = require("./Track");

class Favorite extends Model {}

Favorite.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: false,
    },
    favorite_type: {
      type: DataTypes.ENUM("Artist", "Album", "Track"),
      allowNull: false,
    },
    favorite_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    priority: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
    modelName: "Favorite",
    tableName: "favorites",
    timestamps: true,
    underscored: true,
  }
);

// Define associations
Favorite.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// Polymorphic association: Favorite can belong to Artist, Album, or Track
Favorite.belongsTo(Artist, {
  foreignKey: "favorite_id",
  constraints: false, // Disable constraints for polymorphic relationship
  as: "artist",
});

Favorite.belongsTo(Album, {
  foreignKey: "favorite_id",
  constraints: false, // Disable constraints for polymorphic relationship
  as: "album",
});

Favorite.belongsTo(Track, {
  foreignKey: "favorite_id",
  constraints: false, // Disable constraints for polymorphic relationship
  as: "track",
});

module.exports = Favorite;
