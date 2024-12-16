'use strict';

/** @type {import('sequelize-cli').Migration} */
// src/migrations/XXXXXX-create-recently-played.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('recently_played', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: 'users', // Ensure this references the `users` table
          key: 'id',
        },
        allowNull: false,
      },
      track_id: {
        type: Sequelize.UUID,
        references: {
          model: 'tracks', // Ensure this references the `tracks` table
          key: 'id',
        },
        allowNull: false,
      },
      played_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW, // Automatically set to current time when track is played
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
    await queryInterface.dropTable('recently_played');
  },
};

