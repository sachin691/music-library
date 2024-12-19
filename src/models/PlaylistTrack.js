const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/index");

class PlaylistTrack extends Model {}

PlaylistTrack.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    playlist_id: {
      type: DataTypes.UUID,
      references: {
        model: "playlists",
        key: "id",
      },
      allowNull: false,
    },
    track_id: {
      type: DataTypes.UUID,
      references: {
        model: "tracks",
        key: "id",
      },
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
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
    modelName: "PlaylistTrack",
    tableName: "playlist_tracks",
    timestamps: true,
    underscored: true,
  }
);

module.exports = PlaylistTrack;
