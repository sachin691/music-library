'use strict';

/** @type {import('sequelize-cli').Migration} */
// src/migrations/XXXXXX-create-user-follows.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_follows', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: 'users', // Make sure this references the `users` table
          key: 'id',
        },
        allowNull: false,
      },
      artist_id: {
        type: Sequelize.UUID,
        references: {
          model: 'artists', // Make sure this references the `artists` table
          key: 'id',
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

    // Optionally, add a unique constraint to prevent duplicate follow entries
    await queryInterface.addConstraint('user_follows', {
      fields: ['user_id', 'artist_id'],
      type: 'unique',
      name: 'unique_user_artist_follow',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_follows');
  },
};

