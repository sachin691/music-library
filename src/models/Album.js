// src/models/Album.js
const { Model, DataTypes } = require("sequelize");
const Artist = require("./Artist");
const Organization = require("./Organization");
const sequelize = require("../config/index");

class Album extends Model {
  static associate(models) {
    // Define associations here
    Album.belongsTo(models.Artist, {
      foreignKey: "artist_id",
      as: "artist",
      onDelete: "CASCADE", // Ensuring the album is deleted when artist is deleted
    });
    Album.belongsTo(models.Organization, {
      foreignKey: "organization_id",
      as: "organization",
      onDelete: "CASCADE", // Ensuring the album is deleted when organization is deleted
    });
  }
}

module.exports = Album;
