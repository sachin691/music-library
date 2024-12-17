"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Alter the `users` table to add cascading delete behavior for the foreign key
    await queryInterface.addConstraint("users", {
      fields: ["organization_id"], // The field that holds the foreign key
      type: "foreign key",
      name: "fk_user_organization", // Name for the constraint (optional)
      references: {
        table: "organizations", // The referenced table
        field: "id", // The referenced field
      },
      onDelete: "CASCADE", // This ensures that when an organization is deleted, all associated users will be deleted
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert the changes (drop the foreign key constraint)
    await queryInterface.removeConstraint("users", "fk_user_organization");
  },
};
