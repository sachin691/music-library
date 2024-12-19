// migrations/[timestamp]-create-playlist-track.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("playlist_tracks", {
      playlist_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "playlists",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      track_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "tracks",
          key: "id",
        },
        onDelete: "CASCADE",
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
