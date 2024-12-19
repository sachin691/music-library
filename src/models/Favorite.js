// src/models/Favorite.js
const { Model, DataTypes } = require("sequelize");

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

module.exports = Favorite;
