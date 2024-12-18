const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const User  = require("./User"); // Import User model
const Artist = require("./Artist");

class Organization extends Model {}

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

// Define the association from Organization to User
Organization.hasMany(User, {
  foreignKey: "organization_id", // Linking the organization_id field in User model
  as: "users", // Alias for the relationship
  onDelete: "CASCADE",
});


Organization.hasMany(Artist, {
  foreignKey: "organization_id", // Reference in the artist model
  as: "artists", // Alias for the relationship
  onDelete: "CASCADE"
});

module.exports = Organization;
