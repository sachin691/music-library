"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Removing 'onDelete' cascade from the User model
    await queryInterface.removeConstraint("users", "users_organization_id_fkey"); // Replace with actual constraint name

    // Adding 'onDelete' cascade to the Organization model
    await queryInterface.addConstraint("users", {
      fields: ["organization_id"],
      type: "foreign key",
      name: "users_organization_id_fkey",
      references: {
        table: "organizations",
        field: "id",
      },
      onDelete: "CASCADE", // Add CASCADE delete to organization_id in users
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert changes: Remove the constraint added to Organization model
    await queryInterface.removeConstraint("users", "users_organization_id_fkey");

    // Remove the 'onDelete' from Organization model and revert back to the original state
    await queryInterface.addConstraint("users", {
      fields: ["organization_id"],
      type: "foreign key",
      name: "users_organization_id_fkey",
      references: {
        table: "organizations",
        field: "id",
      },
      onDelete: "SET NULL", // Revert to SET NULL or whatever the previous state was
    });
  },
};
