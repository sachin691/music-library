"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Add `year` and `hidden` fields to the `albums` table
    await queryInterface.addColumn("albums", "year", {
      type: Sequelize.INTEGER,
      allowNull: true, // Optional field, can be null
    });

    await queryInterface.addColumn("albums", "hidden", {
      type: Sequelize.BOOLEAN,
      defaultValue: false, // Default value for hidden is false (not hidden)
      allowNull: false, // Required field
    });

    // 2. Modify the foreign key relationships for `artist_id` and `organization_id` with `onDelete: CASCADE`
    // Remove old foreign key (if it exists) and add new foreign key with `onDelete: CASCADE`
    await queryInterface.removeColumn("albums", "organization_id"); // Remove the previous organization_id if exists
    await queryInterface.addColumn("albums", "organization_id", {
      type: Sequelize.UUID,
      references: {
        model: "organizations", // Reference to the organizations table
        key: "id",
      },
      allowNull: true, // Optional association
      onDelete: "CASCADE", // Cascade delete if the organization is deleted
    });

    await queryInterface.removeColumn("albums", "artist_id"); // Remove the previous artist_id if exists
    await queryInterface.addColumn("albums", "artist_id", {
      type: Sequelize.UUID,
      references: {
        model: "artists", // Reference to the artists table
        key: "id",
      },
      allowNull: false, // The album must be associated with an artist
      onDelete: "CASCADE", // Cascade delete if the artist is deleted
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the changes made in the `up` function

    // Remove `year` and `hidden` columns
    await queryInterface.removeColumn("albums", "year");
    await queryInterface.removeColumn("albums", "hidden");

    // Revert foreign key associations
    await queryInterface.removeColumn("albums", "organization_id");
    await queryInterface.removeColumn("albums", "artist_id");
  },
};
