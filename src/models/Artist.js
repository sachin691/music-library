// src/models/Artist.js
const { Model, DataTypes } = require("sequelize");

class Artist extends Model {
  // Increment followers count
  static async incrementFollowers(artist_id) {
    try {
      const artist = await Artist.findByPk(artist_id); // Find artist by ID
      if (!artist) {
        throw new Error("Artist not found.");
      }
      artist.followers_count += 1; // Increment the count
      await artist.save(); // Save the changes
    } catch (error) {
      console.error("Error incrementing followers count:", error.message);
      throw error; // Re-throw the error for handling in the controller
    }
  }

  // Decrement followers count
  static async decrementFollowers(artist_id) {
    try {
      const artist = await Artist.findByPk(artist_id); // Find artist by ID
      if (!artist) {
        throw new Error("Artist not found.");
      }
      if (artist.followers_count > 0) {
        artist.followers_count -= 1; // Decrement the count (only if > 0)
        await artist.save(); // Save the changes
      }
    } catch (error) {
      console.error("Error decrementing followers count:", error.message);
      throw error; // Re-throw the error for handling in the controller
    }
  }

  // Define associations in the static method
  static associate(models) {
    Artist.belongsTo(models.Organization, {
      foreignKey: "organization_id",
      as: "organization", // Alias for the relationship
      onDelete: "CASCADE",
    });

    Artist.hasMany(models.Album, {
      foreignKey: "artist_id",
      as: "albums", // Alias for the relationship
      onDelete: "CASCADE",
    });

    Artist.hasMany(models.Track, {
      foreignKey: "artist_id",
      as: "tracks", // Alias for the relationship
      onDelete: "CASCADE",
    });

    Artist.belongsToMany(models.User, {
      through: models.UserFollow,
      foreignKey: "artist_id",
      as: "followers", // Alias for the relationship (many-to-many through UserFollow)
    });
  }
}

module.exports = Artist;
