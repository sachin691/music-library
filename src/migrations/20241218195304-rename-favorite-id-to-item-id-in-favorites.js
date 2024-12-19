"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Rename column `favorite_id` to `item_id`
    await queryInterface.renameColumn("favorites", "favorite_id", "item_id");
  },

  down: async (queryInterface, Sequelize) => {
    // Revert column name from `item_id` to `favorite_id`
    await queryInterface.renameColumn("favorites", "item_id", "favorite_id");
  },
};
