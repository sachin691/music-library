'use strict';

/** @type {import('sequelize-cli').Migration} */
// src/migrations/XXXXXX-create-favorites.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('favorites', {
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
      favorite_type: {
        type: Sequelize.ENUM('Artist', 'Album', 'Track'),
        allowNull: false,
      },
      favorite_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      priority: {
        type: Sequelize.INTEGER,
        defaultValue: 0, // Default priority value
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

    // Optionally, you can add an index to speed up the lookup by `user_id` and `favorite_type`
    await queryInterface.addIndex('favorites', ['user_id', 'favorite_type']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('favorites');
  },
};

