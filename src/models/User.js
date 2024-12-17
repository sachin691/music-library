// src/models/User.js

const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const sequelize = require("../config/index"); // Assuming this imports the sequelize instance
const Organization = require("./Organization"); // Import User model

// Enum for role values
const ROLES = ["admin", "editor", "viewer"];

class User extends Model {
  // This method will be called before saving a user to hash the password
  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(10); // Generate a salt
    return bcrypt.hash(password, salt); // Hash the password
  }

  // This method will be called to compare the entered password with the hashed one
  static async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM,
      values: ROLES,
      defaultValue: "viewer",
      allowNull: false,
    },
    organization_id: {
      type: DataTypes.UUID,
      references: {
        model: "organizations",
        key: "id",
      },
      allowNull: true,
    },
    profile_picture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    preferences: {
      type: DataTypes.JSONB,
      allowNull: true, 
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    modelName: "User",
    tableName: "users", 
    timestamps: true, 
    underscored: true, 
    hooks: {
      beforeSave: async (user) => {
        if (user.changed("password")) {
          user.password = await User.hashPassword(user.password);
        }
      },
    },
  }
);

User.belongsTo(Organization, {
  foreignKey: "organization_id", // This will link the user to an organization
  as: "organization", // Alias for the relationship
});

module.exports = User;
