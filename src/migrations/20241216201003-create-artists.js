'use strict';

/** @type {import('sequelize-cli').Migration} */
// migrations/{timestamp}-create-artists.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('artists', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true, // Biography is optional
      },
      followers_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0, // Default to 0 when no one follows the artist
        allowNull: false,
      },
      organization_id: {
        type: Sequelize.UUID,
        references: {
          model: 'organizations', // Referencing the organizations table
          key: 'id',
        },
        allowNull: true, // Not all artists may belong to an organization
      },
      profile_picture: {
        type: Sequelize.STRING, // URL to the artist's profile picture
        allowNull: true,
      },
      tags: {
        type: Sequelize.JSONB, // For storing tags as JSON (e.g., categories like "Pop", "Rock")
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW, // Automatically set the creation timestamp
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW, // Automatically set the update timestamp
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('artists');
  },
};
