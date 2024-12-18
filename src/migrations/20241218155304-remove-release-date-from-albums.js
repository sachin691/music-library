module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Removing the 'release_date' column from 'albums' table
    await queryInterface.removeColumn("albums", "release_date");
  },

  down: async (queryInterface, Sequelize) => {
    // Re-adding the 'release_date' column in case of a rollback
    await queryInterface.addColumn("albums", "release_date", {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },
};
