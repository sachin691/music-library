"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("tracks", "organization_id", {
      type: Sequelize.UUID,
      allowNull: true, // or set to false if it's required
      references: {
        model: "organizations", // Assuming you have an 'organizations' table
        key: "id",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("tracks", "organization_id");
  },
};
