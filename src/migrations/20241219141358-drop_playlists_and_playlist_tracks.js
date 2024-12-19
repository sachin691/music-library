"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Drop the `playlist_tracks` table first (because it depends on `playlists` and `tracks`)
    await queryInterface.dropTable("playlist_tracks");

    // Drop the `playlists` table
    await queryInterface.dropTable("playlists");
  },

  down: async (queryInterface, Sequelize) => {
    // Recreate the `playlists` table
    await queryInterface.createTable("playlists", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      is_public: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      tags: {
        type: Sequelize.JSONB,
        allowNull: true,
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

    // Recreate the `playlist_tracks` table
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
};
