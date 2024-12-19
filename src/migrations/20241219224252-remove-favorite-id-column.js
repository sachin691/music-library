"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("favorites", "favorite_id");
  },

  async down(queryInterface, Sequelize) {
    // Add the column back in case of rollback
    await queryInterface.addColumn("favorites", "favorite_id", {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    });
  },
};
