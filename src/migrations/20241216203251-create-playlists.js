'use strict';

/** @type {import('sequelize-cli').Migration} */
// src/migrations/XXXXXX-create-playlists.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('playlists', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: 'users', // Ensure this references the `users` table
          key: 'id',
        },
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true, // Optional field
      },
      is_public: {
        type: Sequelize.BOOLEAN,
        defaultValue: false, // Default value as false (private playlist)
      },
      tags: {
        type: Sequelize.JSONB,
        allowNull: true, // Optional field
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
    await queryInterface.dropTable('playlists');
  },
};

