"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("playlist_tracks", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      playlist_id: {
        type: Sequelize.UUID,
        references: {
          model: "playlists",
          key: "id",
        },
        allowNull: false,
      },
      track_id: {
        type: Sequelize.UUID,
        references: {
          model: "tracks",
          key: "id",
        },
        allowNull: false,
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("playlist_tracks");
  },
};
