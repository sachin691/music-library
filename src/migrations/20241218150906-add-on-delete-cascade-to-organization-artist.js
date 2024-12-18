"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Update the foreign key constraint on organization_id in the artists table
    await queryInterface.changeColumn("artists", "organization_id", {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "organizations",
        key: "id",
      },
      onDelete: "CASCADE", // Ensures cascading delete behavior
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the foreign key changes, removing the onDelete: 'CASCADE' behavior
    await queryInterface.changeColumn("artists", "organization_id", {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "organizations",
        key: "id",
      },
      onDelete: "SET NULL", // You can change this behavior if necessary, e.g., 'SET NULL' or 'RESTRICT'
    });
  },
};
