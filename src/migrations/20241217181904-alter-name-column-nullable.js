// src/migrations/XXXXXX-alter-name-column-nullable.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Change the `name` column to allow NULL
    await queryInterface.changeColumn("users", "name", {
      type: Sequelize.STRING,
      allowNull: true, // Make it nullable
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Rollback the change (if needed) - make it not nullable again
    await queryInterface.changeColumn("users", "name", {
      type: Sequelize.STRING,
      allowNull: false, // Set back to not nullable
    });
  },
};
