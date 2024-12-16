// src/models/Artist.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const Organization = require("./Organization"); // Import the Organization model if needed

class Artist extends Model {}

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
      references: {
        model: "organizations", // References the `organizations` table
        key: "id",
      },
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

// Define the relationship between Artist and Organization
Artist.belongsTo(Organization, {
  foreignKey: "organization_id", // Organization reference in the artist model
  as: "organization", // Alias for the relationship
});

module.exports = Artist;
