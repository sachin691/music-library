'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("tracks", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      duration: {
        type: Sequelize.INTEGER, // Duration in seconds
        allowNull: false,
      },
      artist_id: {
        type: Sequelize.UUID,
        references: {
          model: "artists", // Reference to the Artists table
          key: "id",
        },
        allowNull: false,
      },
      album_id: {
        type: Sequelize.UUID,
        references: {
          model: "albums", // Reference to the Albums table
          key: "id",
        },
        allowNull: false,
      },
      play_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      likes: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      audio_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lyrics: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      tags: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      organization_id: {
        type: Sequelize.UUID,
        references: {
          model: "organizations", // Reference to the Organizations table
          key: "id",
        },
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
    await queryInterface.dropTable("tracks");
  },
};
