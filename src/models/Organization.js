// src/models/Organization.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/index"); // Sequelize instance

class Organization extends Model {
  // Static method to define associations

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
