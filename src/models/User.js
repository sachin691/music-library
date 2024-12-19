// src/models/User.js

const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const sequelize = require("../config/index");
const { ROLES } = require("../utils/constants");
const Organization = require("./Organization");
const Artist = require("./Artist");
const Favorite = require("./Favorite");
const Playlist = require("./Playlist");

// Enum for role values
const ROLES_ENUM = [ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER];

class User extends Model {
  // This method will be called before saving a user to hash the password
  static async hashPassword(password) {
    try {
      // Hash the password asynchronously
      const hashedPassword = await bcrypt.hash(password, 10);

      return hashedPassword; // Return the hashed password
    } catch (error) {
      console.log("Error hashing password:", error);
      throw error;
    }
  }

  // This method will be called to compare the entered password with the hashed one
  static async comparePassword(enteredPassword, originalPassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(enteredPassword, originalPassword, (err, isMatch) => {
        if (err) {
          reject(err);
        }
        resolve(isMatch);
      });
    });
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
      values: ROLES_ENUM,
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
  }
);

module.exports = User;
