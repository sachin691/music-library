// src/models/Organization.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/index"); // Sequelize instance

class Organization extends Model {
  // Static method to define associations
  static associate(models) {
    // Association with User: One organization can have many users
    Organization.hasMany(models.User, {
      foreignKey: "organization_id",
      as: "users", // Alias for the relationship
      onDelete: "CASCADE",
    });

    // Association with Artist: One organization can have many artists
    Organization.hasMany(models.Artist, {
      foreignKey: "organization_id",
      as: "artists", // Alias for the relationship
      onDelete: "CASCADE",
    });
  }
}

Organization.init(
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
  },
  {
    sequelize,
    modelName: "Organization",
    tableName: "organizations",
    timestamps: true,
  }
);

module.exports = Organization;
