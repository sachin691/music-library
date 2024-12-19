// src/models/Favorite.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/index");

class Favorite extends Model {
  // Static method to define associations
  static associate(models) {
    // Defining the association with User
    Favorite.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });

    // Polymorphic association: Favorite can belong to Artist, Album, or Track
    Favorite.belongsTo(models.Artist, {
      foreignKey: "item_id",
      constraints: false, // Disable constraints for polymorphic relationship
      as: "artist",
    });

    Favorite.belongsTo(models.Album, {
      foreignKey: "item_id",
      constraints: false, // Disable constraints for polymorphic relationship
      as: "album",
    });

    Favorite.belongsTo(models.Track, {
      foreignKey: "item_id",
      constraints: false, // Disable constraints for polymorphic relationship
      as: "track",
    });
  }
}

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

module.exports = Favorite;
