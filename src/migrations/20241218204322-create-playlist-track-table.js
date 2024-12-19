// migrations/[timestamp]-create-playlist-track-table.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("playlist_tracks", {
      playlist_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "playlists", // This refers to the `playlists` table
          key: "id",
        },
        onDelete: "CASCADE", // Delete all associations if a playlist is deleted
      },
      track_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "tracks", // This refers to the `tracks` table
          key: "id",
        },
        onDelete: "CASCADE", // Delete all associations if a track is deleted
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("playlist_tracks");
  },
};
