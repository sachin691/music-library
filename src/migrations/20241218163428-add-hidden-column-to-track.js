"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("tracks", "hidden", {
      type: Sequelize.BOOLEAN,
      defaultValue: false, // Set default to false (not hidden)
      allowNull: false, // Ensure the column is required
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("tracks", "hidden");
  },
};
