"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add the `hidden` and `grammy` columns to the `artists` table
    await queryInterface.addColumn("artists", "hidden", {
      type: Sequelize.BOOLEAN,
      defaultValue: false, // Default to not hidden
      allowNull: false,
    });

    await queryInterface.addColumn("artists", "grammy", {
      type: Sequelize.INTEGER,
      defaultValue: 0, // Default to 0 Grammy awards
      allowNull: false,
    });

    // Remove foreign key constraint for `organization_id` in `artists`
    await queryInterface.removeConstraint("artists", "artists_organization_id_fkey");
  },

  async down(queryInterface, Sequelize) {
    // Revert by removing the `hidden` and `grammy` columns
    await queryInterface.removeColumn("artists", "hidden");
    await queryInterface.removeColumn("artists", "grammy");

    // Re-add foreign key constraint for `organization_id` in `artists`
    await queryInterface.addConstraint("artists", {
      fields: ["organization_id"],
      type: "foreign key",
      name: "artists_organization_id_fkey", // Custom name for the FK constraint
      references: {
        table: "organizations",
        field: "id",
      },
      onDelete: "CASCADE",
    });
  },
};
