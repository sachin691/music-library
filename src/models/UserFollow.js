// src/models/UserFollow.js

const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const User = require("./User");
const Artist = require("./Artist");

class UserFollow extends Model {}

UserFollow.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: false,
    },
    artist_id: {
      type: DataTypes.UUID,
      references: {
        model: "artists",
        key: "id",
      },
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
    modelName: "UserFollow",
    tableName: "user_follows",
    timestamps: true,
    underscored: true,
  }
);

// Define associations
UserFollow.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

UserFollow.belongsTo(Artist, {
  foreignKey: "artist_id",
  as: "artist",
});

module.exports = UserFollow;
