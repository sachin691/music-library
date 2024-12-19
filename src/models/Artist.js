// src/models/Artist.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/index");

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

}

Artist.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    followers_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    organization_id: {
      type: DataTypes.UUID,
      allowNull: true, // Organization is optional
    },
    profile_picture: {
      type: DataTypes.STRING,
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
    grammy: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
    modelName: "Artist",
    tableName: "artists",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Artist;
