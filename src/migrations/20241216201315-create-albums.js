'use strict';

/** @type {import('sequelize-cli').Migration} */
// migrations/{timestamp}-create-albums.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('albums', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      artist_id: {
        type: Sequelize.UUID,
        references: {
          model: 'artists', // The albums table will reference the artists table
          key: 'id',
        },
        allowNull: false, // Each album must be associated with an artist
      },
      release_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      genre: {
        type: Sequelize.STRING, // Genre can be a string, but if you prefer ENUM, you can use Sequelize.ENUM
        allowNull: true,
      },
      cover_image: {
        type: Sequelize.STRING, // URL to the cover image of the album
        allowNull: true,
      },
      organization_id: {
        type: Sequelize.UUID,
        references: {
          model: 'organizations', // The albums table will reference the organizations table
          key: 'id',
        },
        allowNull: true, // Not all albums might belong to an organization
      },
      tags: {
        type: Sequelize.JSONB, // JSONB for storing tags like "Greatest Hits", "Live"
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
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('albums');
  },
};

